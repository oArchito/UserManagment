import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';
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

const CreateUser = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'User',
    department: 'Engineering',
    profileImage: PRESET_AVATARS[3], // Default preset
    status: 'Active'
  });
  const [formLoading, setFormLoading] = useState(false);

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
      await api.post('/users', formData);
      showToast('User created successfully');
      navigate('/users');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create user';
      showToast(errMsg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Create New User" />
        <main className="content-body animate-fade-in">
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/users" className="btn btn-secondary btn-sm">
              ◀ Back to Directory
            </Link>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              
              {/* Profile Image Avatar Selector */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Select Profile Picture</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', margin: '0.5rem 0' }}>
                  <img 
                    src={formData.profileImage} 
                    alt="Preview" 
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '50%', 
                      border: '3px solid var(--primary)', 
                      objectFit: 'cover',
                      marginRight: '1rem' 
                    }} 
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                          width: '40px',
                          height: '40px'
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
              </div>

              {/* Form Input Fields Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name *</label>
                  <input 
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="form-control"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name *</label>
                  <input 
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="form-control"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address *</label>
                  <input 
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">Temporary Password</label>
                  <input 
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Leave blank for default: Welcome123"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input 
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="department">Department</label>
                  <select 
                    id="department"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleChange}
                  >
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

                <div className="form-group">
                  <label className="form-label" htmlFor="role">Role</label>
                  <select 
                    id="role"
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">Account Status</label>
                  <select 
                    id="status"
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
                <Link to="/users" className="btn btn-secondary">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Creating User...' : 'Create User'}
                </button>
              </div>

            </form>
          </div>

        </main>
      </div>
    </div>
  );
};

export default CreateUser;
