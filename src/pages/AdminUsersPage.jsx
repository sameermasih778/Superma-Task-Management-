import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, RotateCcw, Trash2, Bell,
  Search, X, CheckCircle2,
  Send, UserCog, Crown, Code2,
  Eye, User, ShieldAlert, Loader2, UserX, UserCheck
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/toast/ToastContext';

const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30', icon: Crown },
  admin:       { label: 'Admin',       color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30', icon: Shield },
  developer:   { label: 'Developer',   color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', icon: Code2 },
  member:      { label: 'Member',      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', icon: User },
  viewer:      { label: 'Viewer',      color: 'text-zinc-400 bg-zinc-500/15 border-zinc-500/30', icon: Eye },
};

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.viewer;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400', icon: CheckCircle2 },
  inactive:  { label: 'Inactive',  color: 'bg-zinc-800 border-white/10 text-zinc-500',              icon: ShieldAlert },
  suspended: { label: 'Suspended', color: 'bg-red-500/10 border-red-500/25 text-red-400',            icon: UserX },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Broadcast Modal ───────────────────────────────────────────────
function BroadcastModal({ onClose, users = [], currentUser }) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [scope, setScope] = useState('all'); // 'all' | 'user'
  const [targetId, setTargetId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Only active accounts can be notified - a suspended user cannot log in to
  // read it, and notifying them is misleading.
  const notifiableUsers = users.filter(
    u => u.status === 'active' && u.id !== currentUser?.id
  );

  const matchingUsers = userSearch.trim()
    ? notifiableUsers.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      )
    : notifiableUsers;

  const selectedUser = notifiableUsers.find(u => String(u.id) === String(targetId));
  const canSend =
    title.trim() &&
    message.trim() &&
    (scope === 'all' || (scope === 'user' && targetId !== ''));

  const handleSend = async () => {
    if (!canSend) return;
    setLoading(true);
    try {
      const body = {
        title: title.trim(),
        message: message.trim(),
        type: 'announcement'
      };

      // Omitting user_ids entirely means "everyone" on the server, so the
      // broadcast path is unchanged from before.
      if (scope === 'user') body.user_ids = [Number(targetId)];

      const res = await api.post('/admin/notifications/broadcast', body);
      // Raise a toast and close, rather than replacing the whole form with a
      // success banner - the feedback no longer costs the user their input.
      toast.success(res.message || 'Notification sent');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Could not send the notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-2xl p-6 shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-t-2xl" />
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-500/15 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <Bell className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Send Notification</h2>
              <p className="text-[10px] text-zinc-500">Send to everyone, or one specific user</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <div className="space-y-4">
            {/* Recipients: everyone, or one specific user */}
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Send To</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    scope === 'all'
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                      : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  All Users ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope('user')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    scope === 'user'
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                      : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Specific User
                </button>
              </div>
            </div>

            {scope === 'user' && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>

                <div className="max-h-44 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 divide-y divide-white/5">
                  {matchingUsers.length === 0 ? (
                    <p className="p-4 text-center text-[11px] text-zinc-500">
                      No active users match your search.
                    </p>
                  ) : (
                    matchingUsers.map(u => {
                      const isSelected = String(u.id) === String(targetId);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setTargetId(String(u.id))}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                            isSelected ? 'bg-orange-500/10' : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-[10px] shrink-0">
                            {u.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">
                              {u.name}
                              {isSelected && <CheckCircle2 className="inline w-3 h-3 ml-1.5 text-orange-400" />}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">{u.email}</p>
                          </div>
                          <RoleBadge role={u.role} />
                        </button>
                      );
                    })
                  )}
                </div>

                {selectedUser && (
                  <p className="text-[11px] text-zinc-400">
                    Will notify <span className="font-semibold text-white">{selectedUser.name}</span>{' '}
                    <span className="text-zinc-500">({selectedUser.email})</span>
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance Tonight"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your announcement message here..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/60 transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !canSend}
                className="px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-400 text-white rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {loading ? 'Sending...' : scope === 'all' ? 'Send to All' : 'Send to User'}
              </button>
            </div>
          </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // { userId_action: true }

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canManageStaff = isSuperAdmin; // only super_admin may touch super_admin accounts

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.users || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    const key = `${userId}_role`;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to "${newRole}"`);
    } catch (err) {
      toast.error(err.message || 'Role update failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleToggleStatus = async (userId, userName, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';

    if (!window.confirm(
      nextStatus === 'suspended'
        ? `Suspend "${userName}"? They will be blocked from logging in until re-activated.`
        : `Re-activate "${userName}"? They will be able to log in again.`
    )) return;

    const key = `${userId}_status`;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
      toast.success(res.message || 'Status updated');
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleResetPassword = async (userId, userName) => {
    if (!window.confirm(`Reset password for ${userName}? A temporary password will be sent to their email.`)) return;
    const key = `${userId}_reset`;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await api.patch(`/admin/users/${userId}/reset-password`);
      toast.success(res.message || 'Password reset successful');
    } catch (err) {
      toast.error(err.message || 'Password reset failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Permanently delete user "${userName}"? This cannot be undone.`)) return;
    const key = `${userId}_delete`;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(`User "${userName}" deleted`);
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcast && <BroadcastModal onClose={() => setShowBroadcast(false)} users={users} currentUser={currentUser} />}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <UserCog className="w-6 h-6 text-indigo-400" />
            User Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage all registered users — roles, passwords, and account status.
          </p>
        </div>
        <button
          onClick={() => setShowBroadcast(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          Send Notification
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: users.length, color: 'text-white' },
          { label: 'Admins', value: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length, color: 'text-indigo-400' },
          { label: 'Developers', value: users.filter(u => u.role === 'developer').length, color: 'text-emerald-400' },
          { label: 'Active', value: users.filter(u => u.status === 'active').length, color: 'text-blue-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-950 border border-white/10 rounded-xl p-4">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Users Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300 min-w-[700px]">
            <thead className="bg-zinc-900/80 border-b border-white/10 text-zinc-500 uppercase text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Workspaces</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mx-auto mb-2" />
                    <p className="text-zinc-500 text-xs">Loading users...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-white/[0.02] transition-colors ${u.id === currentUser?.id ? 'bg-indigo-500/[0.04]' : ''}`}
                  >
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">
                            {u.name}
                            {u.id === currentUser?.id && (
                              <span className="ml-1.5 text-[9px] text-indigo-400 font-semibold">(you)</span>
                            )}
                          </p>
                          <p className="text-zinc-500 text-[10px]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Selector */}
                    <td className="p-4">
                      {u.id === currentUser?.id ? (
                        <RoleBadge role={u.role} />
                      ) : (
                        <div className="relative inline-block">
                          {actionLoading[`${u.id}_role`] ? (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                          ) : (
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
                              className="appearance-none bg-zinc-900 border border-white/10 text-xs text-white rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-indigo-500/50 cursor-pointer transition-colors hover:border-white/20"
                            >
                              {Object.keys(ROLE_CONFIG).map(r => (
                                <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Workspace Count */}
                    <td className="p-4 text-zinc-400">{u.workspace_count ?? 0}</td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={u.status} />
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 text-zinc-500">
                      {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Suspend / Re-activate */}
                        <button
                          onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                          disabled={!!actionLoading[`${u.id}_status`] || u.id === currentUser?.id || (!canManageStaff && u.role === 'super_admin')}
                          title={u.status === 'active' ? 'Suspend User' : 'Re-activate User'}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            u.status === 'active'
                              ? 'text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10'
                              : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {actionLoading[`${u.id}_status`]
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>

                        {/* Reset Password */}
                        <button
                          onClick={() => handleResetPassword(u.id, u.name)}
                          disabled={!!actionLoading[`${u.id}_reset`] || u.id === currentUser?.id || (!canManageStaff && u.role === 'super_admin')}
                          title="Reset Password"
                          className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {actionLoading[`${u.id}_reset`]
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <RotateCcw className="w-3.5 h-3.5" />
                          }
                        </button>

                        {/* Delete User (Super Admin only) */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={!!actionLoading[`${u.id}_delete`] || u.id === currentUser?.id || u.role === 'super_admin'}
                            title="Delete User"
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {actionLoading[`${u.id}_delete`]
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />
                            }
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
