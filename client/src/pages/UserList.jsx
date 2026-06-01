import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const UserList = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter parameters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal controllers
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        sort
      };
      if (search.trim() !== '') params.search = search;
      if (role) params.role = role;
      if (department) params.department = department;
      if (status) params.status = status;

      const res = await api.get('/users', { params });
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      showToast('Error loading user directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, role, department, status, sort, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search handler is nice, but simple submit or live change is standard
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on filter change
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleDeleteClick = (user) => {
    setSelectedUserForDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserForDelete) return;

    try {
      await api.delete(`/users/${selectedUserForDelete._id}`);
      showToast('User deleted successfully');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const isAdmin = currentUser?.role === 'Admin';
  
  // Checks if current user can edit a given user row
  const canEditUser = (userRow) => {
    if (currentUser?.role === 'Admin') return true;
    if (currentUser?.role === 'Manager') {
      // Manager can update users in their own department, but not Admins
      return userRow.role !== 'Admin' && userRow.department === currentUser.department;
    }
    return currentUser?._id === userRow._id;
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Users Directory" />
        <main className="content-body animate-fade-in">
          
          {/* Header Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Manage system users, roles, statuses, and departments.
              </p>
            </div>
            {isAdmin && (
              <Link to="/users/create" className="btn btn-primary">
                <span>➕</span> Create New User
              </Link>
            )}
          </div>

          {/* Search and Filters Bar */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              {/* Search */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Search Name or Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type to search..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Filter by Role */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter Role</label>
                <select className="form-control" value={role} onChange={handleFilterChange(setRole)}>
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>

              {/* Filter by Department */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter Department</label>
                <select className="form-control" value={department} onChange={handleFilterChange(setDepartment)}>
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support">Support</option>
                  <option value="Finance">Finance</option>
                  <option value="Management">Management</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Filter by Status */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter Status</label>
                <select className="form-control" value={status} onChange={handleFilterChange(setStatus)}>
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Sort By</label>
                <select className="form-control" value={sort} onChange={handleFilterChange(setSort)}>
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="firstName">First Name (A-Z)</option>
                  <option value="-firstName">First Name (Z-A)</option>
                  <option value="lastName">Last Name (A-Z)</option>
                  <option value="-lastName">Last Name (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Directory Table Container */}
          <div className="table-container">
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{
                  border: '4px solid var(--border)',
                  borderTop: '4px solid var(--primary)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={u.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.firstName}`} 
                            alt={`${u.firstName} ${u.lastName}`} 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge ${
                            u.role === 'Admin' ? 'badge-error' : u.role === 'Manager' ? 'badge-warning' : 'badge-primary'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{u.department}</td>
                        <td>
                          <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <Link to={`/users/${u._id}`} className="btn btn-sm btn-secondary" title="View details">
                              👁️ View
                            </Link>
                            
                            {canEditUser(u) ? (
                              <Link to={`/users/edit/${u._id}`} className="btn btn-sm btn-primary" title="Edit details">
                                ✏️ Edit
                              </Link>
                            ) : (
                              <button className="btn btn-sm btn-secondary" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }} title="No permission to edit">
                                ✏️ Edit
                              </button>
                            )}

                            {isAdmin && u._id !== currentUser?._id ? (
                              <button 
                                onClick={() => handleDeleteClick(u)} 
                                className="btn btn-sm btn-danger" 
                                title="Delete user"
                              >
                                🗑️ Delete
                              </button>
                            ) : (
                              isAdmin && (
                                <button className="btn btn-sm btn-danger" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }} title="Cannot delete yourself">
                                  🗑️ Delete
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          No users matching search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controllers */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  ◀️ Previous
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                  <button
                    key={pNum}
                    className={`btn ${page === pNum ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPage(pNum)}
                    style={{ padding: '0.5rem 0.85rem' }}
                  >
                    {pNum}
                  </button>
                ))}
                <button 
                  className="btn btn-secondary" 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Next ▶️
                </button>
              </div>
            </div>
          )}

          {/* Deletion Confirmation Modal */}
          <Modal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedUserForDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Confirm User Deletion"
            message={`Are you sure you want to permanently delete user "${selectedUserForDelete?.firstName} ${selectedUserForDelete?.lastName}" (${selectedUserForDelete?.email})? This action cannot be undone.`}
            confirmText="Delete User"
            type="danger"
          />

        </main>
      </div>
    </div>
  );
};

export default UserList;
