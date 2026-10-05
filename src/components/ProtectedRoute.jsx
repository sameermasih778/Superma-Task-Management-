import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const lastLoginType = localStorage.getItem('suprema_last_login_type');
  const redirectTarget = lastLoginType === 'admin' ? '/admin-login' : '/login';

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm font-medium">Authenticating Suprema Session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTarget} replace />;
}
