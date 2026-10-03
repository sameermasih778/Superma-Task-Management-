import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FolderKanban, Plus, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectsPage() {
  const { user, activeWorkspace } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role permissions
  const canManageProjects = ['super_admin', 'admin', 'member'].includes(user?.role);

  // New Project Modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    try {
      const data = await api.get(`/projects?workspace_id=${activeWorkspace.id}`);
      setProjects(data.projects || []);
    } catch (err) {
      console.warn(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace?.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !activeWorkspace?.id) return;
    setCreating(true);

    try {
      await api.post('/projects', {
        workspace_id: activeWorkspace.id,
        name,
        description,
        color,
        status: 'active'
      });
      setName('');
      setDescription('');
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-white" />
            Workspace Projects
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage projects, milestones, and task deliverables in {activeWorkspace?.name}.
          </p>
        </div>

        {canManageProjects && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500 bg-zinc-950 border border-white/10 rounded-2xl">
          Loading projects from database...
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-zinc-950 border border-white/10 rounded-2xl">
          <FolderKanban className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-white mb-1">No projects found</p>
          <p className="text-xs text-zinc-400">Click "New Project" to create your first workflow project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const progress = p.total_tasks > 0 ? Math.round((p.completed_tasks / p.total_tasks) * 100) : 0;

            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -2 }}
                className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.color || '#6366f1' }} />
                      <h3 className="font-bold text-sm text-white">{p.name}</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2">{p.description || 'No description.'}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-500 font-medium">Completion Progress</span>
                      <span className="text-white font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>{p.total_tasks || 0} Total Tasks</span>
                    <Link to="/dashboard/tasks" className="text-white hover:underline font-semibold flex items-center gap-1">
                      Open Board <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Website Redesign 2026"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project objectives and targets..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Kanban Tag Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 bg-zinc-900 border border-white/10 rounded-xl p-1 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-zinc-400">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl">
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
