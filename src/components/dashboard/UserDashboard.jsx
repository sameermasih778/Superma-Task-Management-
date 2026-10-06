import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  ArrowUpRight,
  Activity,
  ChevronRight,
  CheckSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user, activeWorkspace } = useAuth();
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // 2. Fetch Tasks for task metrics & My Tasks
      const taskData = await api.get(`/tasks?workspace_id=${activeWorkspace.id}`);
      const allTasks = taskData.tasks || [];
      
      // Filter tasks assigned to current user
      const userTasks = allTasks.filter(t => t.assignee_id === user?.id || t.created_by === user?.id);
      setMyTasks(userTasks);

      let completedTks = 0;
      allTasks.forEach(t => {
        if (t.status === 'done') completedTks++;
      });

      // 3. Fetch Teams count
      const teamsData = await api.get(`/teams?workspace_id=${activeWorkspace.id}`);

      // 4. Fetch Activity Logs
      const actData = await api.get(`/activity?workspace_id=${activeWorkspace.id}`);

      setStats({
        totalProjects: fetchedProjects.length,
        totalTasks: allTasks.length,
        completedTasks: completedTks,
        activeTeams: teamsData.count || 0
      });

      setActivities(actData.activities || []);

    } catch (err) {
      console.warn('User dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeWorkspace?.id]);

  return (
    <div className="space-y-8">
      {/* User Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-zinc-400">Workspace:</span>
            <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              {activeWorkspace?.name || 'Default Workspace'}
            </span>
            <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
              Member Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Here's a summary of your assigned tasks and active project workflows.
          </p>
        </div>

        <Link
          to="/dashboard/tasks"
          className="bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <CheckSquare className="w-4 h-4 text-indigo-600" />
          <span>My Tasks Board</span>
        </Link>
      </div>

      {/* User Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.totalProjects}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Workspace Projects</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">My Assigned Tasks</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : myTasks.length}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Assigned to you</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.completedTasks}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">
            {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% team completion
          </p>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Team Members</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.activeTeams}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Collaborators in team</p>
        </div>
      </div>

      {/* Main Grid: My Tasks & Workspace Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* My Tasks Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>My Task Queue</span>
            </h2>
            <Link to="/dashboard/tasks" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium">
              Open Board <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-950 border border-white/10 rounded-2xl">
              Loading your tasks...
            </div>
          ) : myTasks.length === 0 ? (
            <div className="p-8 text-center bg-zinc-950 border border-white/10 rounded-2xl">
              <CheckSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-400 font-medium">You have no pending task assignments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="bg-zinc-950 border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      task.status === 'done' ? 'bg-emerald-400' :
                      task.status === 'in_progress' ? 'bg-amber-400' : 'bg-zinc-600'
                    }`} />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{task.title}</h4>
                      <p className="text-[11px] text-zinc-500 truncate">{task.project_name || 'General Task'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      task.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-semibold bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full capitalize">
                      {task.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Projects List */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Active Projects</h3>
              <Link to="/dashboard/projects" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium">
                All Projects <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project) => {
                const progress = project.total_tasks > 0
                  ? Math.round((project.completed_tasks / project.total_tasks) * 100)
                  : 0;

                return (
                  <div key={project.id} className="bg-zinc-950 border border-white/10 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate">{project.name}</span>
                      <span className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-zinc-300 capitalize">
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500">Completion</span>
                        <span className="text-white font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Feed (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Team Updates</span>
            </h2>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No recent updates.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{act.user_name || 'Team Member'}</span>
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
