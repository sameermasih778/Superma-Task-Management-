import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from '../components/dashboard/UserDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

export default function DashboardOverview() {
  const { user } = useAuth();

  // Determine if logged-in user is Admin or Developer
  const activeLoginType = sessionStorage.getItem('suprema_login_type') || localStorage.getItem('suprema_last_login_type');
  const isStaffOrAdmin =
    activeLoginType === 'admin' ||
    ['super_admin', 'admin', 'developer'].includes(user?.role);

  return isStaffOrAdmin ? <AdminDashboard /> : <UserDashboard />;
}
