import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Debug logs
  console.log('PrivateRoute:', {
    path: location.pathname,
    user,
    allowedRoles,
    loading,
    storedRole: localStorage.getItem('userRole'),
    storedUser: localStorage.getItem('user')
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  console.log('Role check:', {
    userRole,
    normalizedAllowedRoles,
    hasAccess: allowedRoles.length === 0 || normalizedAllowedRoles.includes(userRole)
  });

  if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    console.log(`User with role ${userRole} denied access to ${location.pathname}`);
    const redirectPath = userRole === 'babysitter' ? '/babysitter-dashboard' : '/parent-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
} 