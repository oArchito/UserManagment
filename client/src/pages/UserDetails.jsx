import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        showToast('Error loading user details', 'error');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar title="User Profile Details" />
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

  const canEdit = currentUser?.role === 'Admin' || 
    (currentUser?.role === 'Manager' && user?.role !== 'Admin' && user?.department === currentUser?.department) ||
    currentUser?._id === user?._id;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={`${user?.firstName} ${user?.lastName}`} />
        <main className="content-body animate-fade-in">
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/users" className="btn btn-secondary btn-sm">
              ◀ Back to Directory
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '2rem',
          }}>
            {/* Left Col - Avatar Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' }}>
              <img 
                src={user?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.firstName}`} 
                alt={`${user?.firstName} ${user?.lastName}`}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  border: '4px solid var(--primary-glow)'
                }}
              />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {user?.firstName} {user?.lastName}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {user?.email}
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span className={`badge ${
                  user?.role === 'Admin' ? 'badge-error' : user?.role === 'Manager' ? 'badge-warning' : 'badge-primary'
                }`}>
                  {user?.role}
                </span>
                <span className={`badge ${user?.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                  {user?.status}
                </span>
              </div>

              {canEdit && (
                <Link to={`/users/edit/${user?._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  ✏️ Edit Profile
                </Link>
              )}
            </div>

            {/* Right Col - User Info sheet */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                Profile Information
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
              }}>
                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>First Name</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.firstName}</p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Last Name</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.lastName}</p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Email Address</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.email}</p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Phone Number</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Department</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.department}</p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>System Role</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.role}</p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Account Status</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.status}</p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Registered On</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {new Date(user?.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Last Updated</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {new Date(user?.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .content-body > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDetails;
