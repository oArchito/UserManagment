import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          border: '4px solid var(--border-color, #e2e8f0)',
          borderTop: '4px solid var(--primary-color, #4f46e5)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        margin: '2rem auto',
        maxWidth: '500px',
        textAlign: 'center',
        background: 'var(--card-bg, #ffffff)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow, 0 4px 6px -1px rgba(0,0,0,0.1))',
        border: '1px solid var(--border-color, #e2e8f0)',
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--text-color, #1e293b)'
      }}>
        <div style={{
          fontSize: '3rem',
          color: '#ef4444',
          marginBottom: '1rem'
        }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-light, #64748b)', marginBottom: '1.5rem' }}>
          Your account role ({user.role}) does not have permission to view this page.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '0.625rem 1.25rem',
            background: 'var(--primary-color, #4f46e5)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
