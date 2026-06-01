import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=robert',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=alice',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=bob',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=charlie',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=diana',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=evan'
];

const Profile = () => {
  const { user, updateCurrentUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: '',
    password: '' // Optional password modification
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (url) => {
    setFormData({ ...formData, profileImage: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email } = formData;
    if (!firstName || !lastName || !email) {
      return showToast('First Name, Last Name, and Email are required', 'error');
    }

    setFormLoading(true);
    try {
      const payload = { ...formData };
      if (payload.password.trim() === '') {
        delete payload.password;
      }

      const res = await api.put(`/users/${user._id}`, payload);
      updateCurrentUser(res.data);
      showToast('Your profile has been updated successfully');
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      showToast(errMsg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="My Profile" />
        <main className="content-body animate-fade-in">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '2rem',
          }}>
            {/* Left Column Profile Indicator Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' }}>
              <img 
                src={formData.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${formData.firstName}`} 
                alt={`${formData.firstName} ${formData.lastName}`}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  border: '3px solid var(--primary-glow)'
                }}
              />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {user?.firstName} {user?.lastName}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {user?.email}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <span className="badge badge-primary">{user?.role}</span>
                <span className="badge badge-success">{user?.department}</span>
              </div>
            </div>

            {/* Right Column Profile Editor Form */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                Account Settings
              </h3>
              
              <form onSubmit={handleSubmit}>
                
                {/* Visual Avatar Selector */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Select Profile Picture</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {PRESET_AVATARS.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => handleAvatarSelect(url)}
                        style={{
                          background: 'none',
                          border: formData.profileImage === url ? '2px solid var(--primary)' : '2px solid transparent',
                          borderRadius: '50%',
                          padding: '2px',
                          cursor: 'pointer',
                          width: '38px',
                          height: '38px'
                        }}
                      >
                        <img 
                          src={url} 
                          alt="Preset" 
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem'
                }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First Name</label>
                    <input 
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last Name</label>
                    <input 
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input 
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input 
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Change Password</label>
                    <input 
                      id="password"
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Type a new password to modify"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Updating Profile...' : 'Save Profile'}
                  </button>
                </div>

              </form>
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

export default Profile;
