import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data);
      } catch (err) {
        showToast('Failed to load dashboard statistics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar title="Dashboard Dashboard" />
          <div className="content-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{
              border: '4px solid var(--border)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentages helper for visual charts
  const getPercentage = (value, total) => {
    if (!total) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  // Color mapping helper for departments
  const getDeptColor = (index) => {
    const colors = [
      '#6366f1', // Indigo
      '#10b981', // Emerald
      '#3b82f6', // Blue
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#8b5cf6'  // Purple
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard Statistics" />
        <main className="content-body animate-fade-in">
          
          {/* Dashboard Metrics Grid */}
          <div className="dashboard-grid">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="card-title">Total Users</div>
                  <div className="card-value">{stats?.totalUsers || 0}</div>
                </div>
                <div style={{ fontSize: '2rem' }}>👥</div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="card-title">Active Users</div>
                  <div className="card-value" style={{ color: 'var(--success)' }}>{stats?.activeUsers || 0}</div>
                </div>
                <div style={{ fontSize: '2rem' }}>🟢</div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--error)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="card-title">Inactive Users</div>
                  <div className="card-value" style={{ color: 'var(--error)' }}>{stats?.inactiveUsers || 0}</div>
                </div>
                <div style={{ fontSize: '2rem' }}>🔴</div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="card-title">Active Ratio</div>
                  <div className="card-value">
                    {getPercentage(stats?.activeUsers, stats?.totalUsers)}
                  </div>
                </div>
                <div style={{ fontSize: '2rem' }}>📈</div>
              </div>
            </div>
          </div>

          {/* Custom Visualization Charts Grid */}
          <div className="charts-grid">
            
            {/* Department distribution */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Users by Department</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.departmentStats?.map((dept, index) => (
                  <div key={dept.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{dept.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{dept.value} ({getPercentage(dept.value, stats.totalUsers)})</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          backgroundColor: getDeptColor(index), 
                          width: getPercentage(dept.value, stats.totalUsers),
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} 
                      />
                    </div>
                  </div>
                ))}
                {(!stats?.departmentStats || stats.departmentStats.length === 0) && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                    No department data available.
                  </div>
                )}
              </div>
            </div>

            {/* Role representation distribution */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Role Allocations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {stats?.roleStats?.map((role) => {
                  let roleColor = 'var(--primary)';
                  if (role.name === 'Admin') roleColor = '#ef4444'; // Red
                  if (role.name === 'Manager') roleColor = '#f59e0b'; // Gold

                  return (
                    <div key={role.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: roleColor
                      }}>
                        {role.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          <span>{role.name}s</span>
                          <span>{role.value} Users</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              backgroundColor: roleColor, 
                              width: getPercentage(role.value, stats.totalUsers),
                              borderRadius: '3px'
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Registrations Data Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Registrations</h3>
              <Link to="/users" className="btn btn-sm btn-primary">
                View All Users
              </Link>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentRegistrations?.map((u) => (
                    <tr key={u._id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={u.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.firstName}`} 
                          alt="Avatar"
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</span>
                      </td>
                      <td>{u.email}</td>
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
                      <td style={{ color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentRegistrations || stats.recentRegistrations.length === 0) && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
