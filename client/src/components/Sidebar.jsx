import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully');
      navigate('/login');
    } catch (err) {
      showToast('Logout failed', 'error');
    }
  };

  const hasAccessToManagement = ['Admin', 'Manager'].includes(user?.role);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">U</div>
        <span className="sidebar-title">Portal Admin</span>
      </div>

      <nav className="sidebar-menu">
        {hasAccessToManagement && (
          <>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink 
              to="/users" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end
            >
              <span>👥</span> Users Directory
            </NavLink>
          </>
        )}

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span>👤</span> My Profile
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span>⚙️</span> Settings
        </NavLink>

        <button 
          onClick={handleLogout} 
          className="sidebar-link" 
          style={{ 
            background: 'none', 
            border: 'none', 
            width: '100%', 
            textAlign: 'left', 
            cursor: 'pointer',
            marginTop: 'auto' 
          }}
        >
          <span>🚪</span> Sign Out
        </button>
      </nav>

      {user && (
        <div className="sidebar-footer">
          <img 
            className="sidebar-avatar" 
            src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.firstName}`} 
            alt={`${user.firstName} ${user.lastName}`} 
          />
          <div className="sidebar-user-info">
            <div className="sidebar-username">{user.firstName} {user.lastName}</div>
            <div className="sidebar-userrole">{user.role} • {user.department}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
