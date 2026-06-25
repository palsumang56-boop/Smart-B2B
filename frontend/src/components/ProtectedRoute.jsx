// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const { token, role } = useSelector((state) => state.auth);

  // If no token exists, bounce them back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and it doesn't match, bounce them to an unauthorized view (or back to their safe zone)
  if (allowedRole && role !== allowedRole) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized Access</h1>
        <p className="mt-4 text-gray-600">You do not have permission to view this workspace.</p>
      </div>
    );
  }

  // If everything checks out, render the requested component
  return children;
}