import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Terminal,
  Server,
  Database,
  Users,
  FolderKanban,
  Activity,
  Globe,
  RefreshCw,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, activeWorkspace } = useAuth();
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('Online (Port 3306)');
  const [serverHealth, setServerHealth] = useState('UP (Port 5000)');

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    activeTeams: 0,
    totalLogs: 0
  });

  const fetchData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);

    try {
      // 1. Fetch Projects
      const projData = await api.get(`/projects?workspace_id=${activeWorkspace.id}`);
      const fetchedProjects = projData.projects || [];
      setProjects(fetchedProjects);

      // 2. Fetch Teams count
      const teamsData = await api.get(`/teams?workspace_id=${activeWorkspace.id}`);

      // 3. Fetch Activity Audit Logs
      const actData = await api.get(`/activity?workspace_id=${activeWorkspace.id}`);
      const fetchedActivities = actData.activities || [];
      setActivities(fetchedActivities);

      setStats({
        totalProjects: fetchedProjects.length,
        totalTasks: fetchedProjects.reduce((acc, p) => acc + (p.total_tasks || 0), 0),
        activeTeams: teamsData.count || 0,
        totalLogs: fetchedActivities.length
      });

    } catch (err) {
      console.warn('Admin dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeWorkspace?.id]);

  return (
    <div className="space-y-8">
      {/* Admin Cyber Control Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-zinc-950 to-black p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.12)]">
        <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/15 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrative & Developer Portal
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-white/10 px-2 py-0.5 rounded-md">
                RBAC Active
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Admin System Console</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </h1>
            
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Logged in as <strong className="text-white capitalize">{user?.name}</strong> ({user?.role || 'Administrator'}) • Full System Privileges Enabled
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Public Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* System Health & Core Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-indigo-500/20 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Database Health</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-mono font-bold text-white truncate">suprema_db</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{dbStatus}</span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-indigo-500/20 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Server API Status</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-mono font-bold text-white truncate">Express v4.21</p>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 mt-1">
            <Terminal className="w-3 h-3" />
            <span>{serverHealth}</span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.totalProjects}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Across all workspace boards</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Audit Logs Count</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.totalLogs}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Audit logs recorded</p>
        </div>
      </div>

      {/* Admin Controls & Security Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Admin Control Actions & Projects Summary (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Staff Controls Panel */}
          <div className="bg-zinc-950 border border-white/10 p-6 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Administrative Privilege Controls</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-zinc-900/80 border border-white/10 rounded-xl text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Super Admin</span>
                <span className="text-xs font-semibold text-white">Full System Access</span>
                <p className="text-[10px] text-zinc-500">Create, Edit, Delete all resources</p>
              </div>

              <div className="p-3.5 bg-zinc-900/80 border border-white/10 rounded-xl text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Developer</span>
                <span className="text-xs font-semibold text-white">API & DB Controls</span>
                <p className="text-[10px] text-zinc-500">Endpoints & backend management</p>
              </div>

              <div className="p-3.5 bg-zinc-900/80 border border-white/10 rounded-xl text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Standard User</span>
                <span className="text-xs font-semibold text-white">Member Workspace</span>
                <p className="text-[10px] text-zinc-500">Personal task queue access</p>
              </div>
            </div>
          </div>

          {/* Active Projects Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">System Projects Overview</h3>
              <Link to="/dashboard/projects" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium">
                Manage Projects <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => {
                const progress = project.total_tasks > 0 
                  ? Math.round((project.completed_tasks / project.total_tasks) * 100) 
                  : 0;

                return (
                  <div key={project.id} className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.color || '#6366f1' }} />
                        <h4 className="font-bold text-xs text-white">{project.name}</h4>
                      </div>
                      <span className="text-[9px] font-bold bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full uppercase">
                        {project.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Task Completion</span>
                        <span className="text-white font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Global System Activity & Security Logs Feed (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Security Audit Trail</span>
            </h2>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 divide-y divide-white/5 max-h-[480px] overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No security logs recorded.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">{act.user_name || 'System Action'}</span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] font-mono">
                    Action: <span className="text-emerald-400">{act.action}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
