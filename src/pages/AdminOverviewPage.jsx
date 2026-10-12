import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, FolderKanban, Users, CheckSquare, Loader2,
  AlertCircle, RefreshCw, TrendingUp, Crown, Code2,
  User, Shield, BarChart3, Activity, ChevronDown, ChevronRight
} from 'lucide-react';
import api from '../utils/api';

/**
 * Platform Overview — workspace & project oversight for super admins.
 *
 * Aggregates platform-level statistics and lists all workspaces with their
 * member/project counts and owner information.
 */

const StatCard = ({ icon: Icon, label, value, sub, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald:'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber:  'bg-amber-500/10  text-amber-400  border-amber-500/20',
    rose:   'bg-rose-500/10   text-rose-400   border-rose-500/20',
    blue:   'bg-blue-500/10   text-blue-400   border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-zinc-900/60 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-zinc-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value ?? '—'}</p>
        {sub && <p className="text-[11px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

const PlanBadge = ({ plan }) => {
  const map = {
    enterprise: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    pro:        'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    free:       'bg-zinc-500/15  text-zinc-400  border-zinc-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${map[plan] || map.free}`}>
      {plan}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const map = {
    super_admin: { cls: 'bg-rose-500/15 text-rose-400 border-rose-500/20',     icon: Crown },
    admin:       { cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20',   icon: Shield },
    developer:   { cls: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',icon: Code2 },
    member:      { cls: 'bg-zinc-500/15  text-zinc-400   border-zinc-500/20',   icon: User },
  };
  const cfg = map[role] || map.member;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cfg.cls}`}>
      <Icon className="w-2.5 h-2.5" />
      {role?.replace('_', ' ')}
    </span>
  );
};

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  return isNaN(d) ? '—' : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function AdminOverviewPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [wsExpanded, setWsExpanded] = useState(null); // workspace id

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/overview');
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load platform overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading platform overview…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      </div>
    );
  }

  const { stats, workspaces = [], recentUsers = [] } = data || {};
  const u = stats?.users || {};
  const w = stats?.workspaces || {};
  const p = stats?.projects || {};
  const t = stats?.tasks || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Platform Overview
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Workspace & project oversight across the entire platform.</p>
        </div>
        <button
          onClick={fetchOverview}
          className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Platform Stats ── */}
      <section>
        <h2 className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-4">Platform Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}        label="Total Users"     value={u.total_users}       color="indigo" />
          <StatCard icon={Building2}    label="Workspaces"      value={w.total_workspaces}  color="blue"   />
          <StatCard icon={FolderKanban} label="Projects"        value={p.total_projects}    color="purple" />
          <StatCard icon={CheckSquare}  label="Tasks"           value={t.total_tasks}       color="emerald"/>
        </div>
      </section>

      {/* ── User Breakdown ── */}
      <section>
        <h2 className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-4">User Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={Crown}    label="Super Admins" value={u.super_admins}    color="rose"   />
          <StatCard icon={Shield}   label="Admins"       value={u.admins}          color="amber"  />
          <StatCard icon={Code2}    label="Developers"   value={u.developers}      color="indigo" />
          <StatCard icon={User}     label="Members"      value={u.members}         color="blue"   />
          <StatCard icon={Activity} label="Active"       value={u.active_users}    color="emerald"/>
        </div>
      </section>

      {/* ── Workspace & Plan Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-zinc-900/60 space-y-3">
          <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-500">Plan Split</h3>
          {[
            { label: 'Free',       value: w.free_plan,       max: w.total_workspaces, color: 'bg-zinc-500' },
            { label: 'Pro',        value: w.pro_plan,        max: w.total_workspaces, color: 'bg-indigo-500' },
            { label: 'Enterprise', value: w.enterprise_plan, max: w.total_workspaces, color: 'bg-amber-500' },
          ].map(({ label, value, max, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">{label}</span>
                <span className="text-zinc-300 font-semibold">{value ?? 0}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: max ? `${Math.round(((value ?? 0) / max) * 100)}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-zinc-900/60 space-y-3">
          <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-500">Project Status</h3>
          {[
            { label: 'Active',    value: p.active_projects,    color: 'bg-emerald-500' },
            { label: 'Completed', value: p.completed_projects, color: 'bg-blue-500'    },
            { label: 'On Hold',   value: p.on_hold_projects,   color: 'bg-amber-500'   },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">{label}</span>
                <span className="text-zinc-300 font-semibold">{value ?? 0}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: p.total_projects ? `${Math.round(((value ?? 0) / p.total_projects) * 100)}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-zinc-900/60 space-y-3">
          <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-500">Task Status</h3>
          {[
            { label: 'To Do',       value: t.todo,        color: 'bg-zinc-500'    },
            { label: 'In Progress', value: t.in_progress, color: 'bg-indigo-500'  },
            { label: 'Done',        value: t.done,        color: 'bg-emerald-500' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">{label}</span>
                <span className="text-zinc-300 font-semibold">{value ?? 0}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: t.total_tasks ? `${Math.round(((value ?? 0) / t.total_tasks) * 100)}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Workspace List ── */}
      <section>
        <h2 className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-4">
          All Workspaces <span className="opacity-50 ml-1">({workspaces.length})</span>
        </h2>
        <div className="space-y-2">
          {workspaces.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-12">No workspaces found.</p>
          ) : (
            workspaces.map((ws) => (
              <div key={ws.id} className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden">
                {/* Row */}
                <button
                  onClick={() => setWsExpanded(wsExpanded === ws.id ? null : ws.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{ws.name}</span>
                      <PlanBadge plan={ws.plan} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Owner: {ws.owner_name} · Created {formatDate(ws.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-right flex-shrink-0">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{ws.member_count}</p>
                      <p className="text-[10px] text-zinc-600">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{ws.project_count}</p>
                      <p className="text-[10px] text-zinc-600">Projects</p>
                    </div>
                    {wsExpanded === ws.id
                      ? <ChevronDown className="w-4 h-4 text-zinc-500" />
                      : <ChevronRight className="w-4 h-4 text-zinc-500" />
                    }
                  </div>
                </button>

                {/* Expanded details */}
                {wsExpanded === ws.id && (
                  <div className="border-t border-white/10 px-5 py-4 bg-zinc-950/50 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-zinc-500 block mb-0.5">Workspace ID</span>
                      <span className="text-zinc-300 font-mono">#{ws.id}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-0.5">Slug</span>
                      <span className="text-zinc-300 font-mono">{ws.slug}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-0.5">Owner Email</span>
                      <span className="text-zinc-300">{ws.owner_email || '—'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-0.5">Plan</span>
                      <PlanBadge plan={ws.plan} />
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-0.5">Members</span>
                      <span className="text-zinc-300">{ws.member_count}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-0.5">Projects</span>
                      <span className="text-zinc-300">{ws.project_count}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Recent Signups ── */}
      <section>
        <h2 className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-4">Recent Signups (Last 10)</h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900/80">
                <th className="text-left px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-zinc-600">No users found.</td>
                </tr>
              ) : (
                recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition">
                    <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-zinc-400 hidden sm:table-cell">{u.email}</td>
                    <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-3 text-zinc-500 hidden md:table-cell">{formatDate(u.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
