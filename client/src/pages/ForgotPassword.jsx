import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState(''); // Testing convenience shortcut
  
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return showToast('Please enter your email', 'error');

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      showToast('Reset email processed successfully');
      
      // Extract development convenience reset URL if returned by server
      if (res.data?.resetUrl) {
        setResetLink(res.data.resetUrl);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error requesting password reset', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email and we'll send a password recovery link</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email"
                className="form-control"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Sending Request...' : 'Send Recovery Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              If an account exists with that email, a password reset link has been dispatched (and logged to the server console).
            </p>
            
            {resetLink && (
              <div style={{
                background: 'var(--success-bg)',
                border: '1px solid var(--success)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                <span style={{ fontWeight: 700, color: 'var(--success)', display: 'block', marginBottom: '0.5rem' }}>
                  🛠️ Dev Mode Testing Shortcut:
                </span>
                <a href={resetLink} style={{ fontWeight: 600, wordBreak: 'break-all' }}>
                  Click here to Reset Password
                </a>
              </div>
            )}
            
            <button 
              onClick={() => { setSuccess(false); setResetLink(''); }}
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Request Again
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <Link to="/login" style={{ fontWeight: 600 }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
