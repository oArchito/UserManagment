import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = passwordData;

    if (!password || !confirmPassword) {
      return showToast('Please fill in both password fields', 'error');
    }

    if (password.length < 6) {
      return showToast('Password must be at least 6 characters long', 'error');
    }

    if (password !== confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }

    setLoading(true);
    try {
      await api.put(`/users/${user._id}`, { password });
      showToast('Password updated successfully');
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Settings" />
        <main className="content-body animate-fade-in">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Visual theme settings */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Appearance Settings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Toggle the system theme between Light and Dark mode appearance.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontWeight: 600, display: 'block' }}>Dark Mode Theme</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Current theme active: <strong>{theme.toUpperCase()}</strong>
                  </span>
                </div>
                <button 
                  onClick={toggleTheme} 
                  className="btn btn-primary"
                  style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                  {theme === 'light' ? '🌙 Enable Dark Mode' : '☀️ Enable Light Mode'}
                </button>
              </div>
            </div>

            {/* Change Password settings card */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Change Security Password</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Modify your account credentials.
              </p>

              <form onSubmit={handleSubmitPassword} style={{ maxWidth: '500px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">New Password</label>
                  <input 
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                  {loading ? 'Saving...' : 'Update Password'}
                </button>
              </form>
            </div>
            
          </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;
