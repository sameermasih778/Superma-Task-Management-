import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isStaffRole } from '../utils/avatar';

/**
 * Route guard for member-only pages.
 *
 * Currently /dashboard/profile, which exists so a member can upload a profile
 * picture. Staff (super_admin / admin / developer) use a fixed role emblem and
 * have nothing to change there, so their sidebar link is hidden and this guard
 * stops them reaching the page by typing the URL.
 *
 * The API independently refuses avatar uploads for staff (see
 * authController.uploadAvatar), so hiding the link alone would not be enough -
 * this simply avoids showing a page that has nothing on it.
 */
export default function MemberRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  const loginType =
    sessionStorage.getItem('suprema_login_type') || localStorage.getItem('suprema_last_login_type');
  const isStaff = loginType === 'admin' || isStaffRole(user?.role);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm font-medium text-zinc-400">Verifying account type...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={isStaff ? '/admin-login' : '/login'} replace />;
  }

  if (isStaff) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/10">
            <ShieldCheck className="h-7 w-7 text-indigo-400" />
          </div>
          <h1 className="mb-2 text-xl font-bold tracking-tight text-white">
            Not available for staff
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-zinc-500">
            Staff accounts use a fixed role emblem, so there is no profile picture to
            change. Profile settings are for member and viewer accounts.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black transition-colors hover:bg-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}