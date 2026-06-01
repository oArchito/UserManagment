import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Navbar = ({ title = 'Management Portal' }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="navbar-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* User Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <img 
              src={user?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.firstName}`} 
              alt="Avatar"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid var(--primary)',
                objectFit: 'cover'
              }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
              ▼
            </span>
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop closer */}
              <div 
                onClick={() => setDropdownOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 998
                }}
              />
              <div style={{
                position: 'absolute',
                top: '45px',
                right: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem 0',
                width: '180px',
                zIndex: 999,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Link 
                  to="/profile" 
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem'
                  }}
                  className="dropdown-item"
                >
                  👤 My Profile
                </Link>
                <Link 
                  to="/settings" 
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem'
                  }}
                  className="dropdown-item"
                >
                  ⚙️ Settings
                </Link>
                <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: '0.5rem 0' }} />
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    color: '#ef4444',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        .dropdown-item:hover {
          background-color: var(--bg-app);
          color: var(--primary) !important;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
