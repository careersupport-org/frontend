import React from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from '../services/AuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute; 