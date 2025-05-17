import React from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from '../services/AuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!AuthService.isAuthenticated()) {
    alert("로그인 후 이용 가능한 서비스입니다. 로그인 페이지로 이동합니다.")
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute; 