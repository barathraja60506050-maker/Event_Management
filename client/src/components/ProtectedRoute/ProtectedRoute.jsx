import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader/Loader';

/**
 * Wraps a route element. Redirects guests to /login (preserving the
 * intended destination), and optionally restricts by role — e.g.
 * <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loader fullScreen label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
