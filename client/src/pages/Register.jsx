import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    department: 'Engineering'
  });
  const [formLoading, setFormLoading] = useState(false);

  const { register, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (['Admin', 'Manager'].includes(user.role)) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = formData;
    
    if (!firstName || !lastName || !email || !password) {
      return showToast('Please fill in all required fields', 'error');
    }

    if (password.length < 6) {
      return showToast('Password must be at least 6 characters long', 'error');
    }

    setFormLoading(true);
    try {
      await register(formData);
      showToast('Registration successful! Welcome aboard.');
      navigate('/profile');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-fade-in" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the portal to manage your profile</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name *</label>
              <input 
                id="firstName"
                name="firstName"
                type="text"
                className="form-control"
                placeholder="John"
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
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input 
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="john.doe@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password *</label>
            <input 
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={formData.password}
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

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={formLoading}
          >
            {formLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
