import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Department } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredDepartment?: Department;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredDepartment 
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredDepartment && user?.department !== requiredDepartment) {
    return <Navigate to={`/${user?.department}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;