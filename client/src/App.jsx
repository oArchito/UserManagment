import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components & Page Guards
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected Pages (All Users)
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserDetails from './pages/UserDetails';

// Protected Management Pages (Admin & Manager)
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';

// Protected Admin-Only Pages
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';

// Catch-All Redirector
const DefaultRouteRedirect = () => {
  const { user, token } = useAuth();
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (['Admin', 'Manager'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/profile" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Routes: General (All authenticated users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/users/:id" element={<UserDetails />} />
              </Route>

              {/* Protected Routes: Management (Admin & Manager only) */}
              <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserList />} />
              </Route>

              {/* Protected Routes: Admin-Only (Admin can create, and edit details) */}
              {/* Note: Managers can edit assigned users too, so let's allow Admin & Manager on edit route, but EditUser page itself will restrict Manager actions. */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/users/create" element={<CreateUser />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
                <Route path="/users/edit/:id" element={<EditUser />} />
              </Route>

              {/* Default fallback route */}
              <Route path="*" element={<DefaultRouteRedirect />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
