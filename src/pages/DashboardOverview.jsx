import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  ArrowUpRight,
  Activity,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const { user, activeWorkspace } = useAuth();

  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats calculation
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeTeams: 0
  });

  const fetchData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);

    try {
      // 1. Fetch Projects
      const projData = await api.get(`/projects?workspace_id=${activeWorkspace.id}`);
      const fetchedProjects = projData.projects || [];
      setProjects(fetchedProjects);

      // 2. Calculate Task Stats
      let totalTks = 0;
      let completedTks = 0;
      fetchedProjects.forEach(p => {
        totalTks += p.total_tasks || 0;
        completedTks += p.completed_tasks || 0;
      });

      // 3. Fetch Teams count
      const teamsData = await api.get(`/teams?workspace_id=${activeWorkspace.id}`);

      // 4. Fetch Activity Logs
      const actData = await api.get(`/activity?workspace_id=${activeWorkspace.id}`);

      setStats({
        totalProjects: fetchedProjects.length,
        totalTasks: totalTks,
        completedTasks: completedTks,
        activeTeams: teamsData.count || 0
      });

      setActivities(actData.activities || []);

    } catch (err) {
      console.warn('Dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeWorkspace?.id]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-white/5 blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-zinc-400">Workspace:</span>
            <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              {activeWorkspace?.name || 'Default Workspace'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Here's what's happening across your project workflows today.
          </p>
        </div>

        <Link
          to="/dashboard/projects"
          className="bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.totalProjects}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Active in {activeWorkspace?.name}</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Total Tasks</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.totalTasks}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Across all project boards</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.completedTasks}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">
            {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion rate
          </p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Active Teams</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.activeTeams}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Collaborators & Leaders</p>
        </div>
      </div>

      {/* Two Column Section: Active Projects & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Active Projects</h2>
            <Link to="/dashboard/projects" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-950 border border-white/10 rounded-2xl">
              Loading projects from database...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center bg-zinc-950 border border-white/10 rounded-2xl">
              <FolderKanban className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-400 font-medium">No projects in this workspace yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => {
                const progress = project.total_tasks > 0 
                  ? Math.round((project.completed_tasks / project.total_tasks) * 100) 
                  : 0;

                return (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -2 }}
                    className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color || '#6366f1' }}
                        />
                        <h3 className="font-bold text-sm text-white">{project.name}</h3>
                      </div>
                      <span className="text-[10px] font-semibold bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full capitalize">
                        {project.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {project.description || 'No description provided.'}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500 font-medium">Progress</span>
                        <span className="text-white font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-white/5">
                      <span>{project.total_tasks || 0} Tasks</span>
                      <Link
                        to="/dashboard/tasks"
                        className="text-white hover:underline font-medium flex items-center gap-1"
                      >
                        Board <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Workspace Activity Logs (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Recent Activity
            </h2>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No recent audit logs.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{act.user_name || 'System'}</span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Action: <span className="text-zinc-200 font-mono">{act.action}</span>
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
