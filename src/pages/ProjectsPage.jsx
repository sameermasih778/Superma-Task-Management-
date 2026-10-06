import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FolderKanban, Plus, ArrowUpRight, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateProjectModal from '../components/dashboard/CreateProjectModal';

export default function ProjectsPage() {
  const { user, activeWorkspace } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role permissions
  const canManageProjects = ['super_admin', 'admin', 'member'].includes(user?.role);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    try {
      const data = await api.get(`/projects?workspace_id=${activeWorkspace.id}`);
      setProjects(data.projects || []);
    } catch (err) {
      console.warn('Fetch projects error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace?.id]);

  const handleOpenCreateModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
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
            onClick={handleOpenCreateModal}
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
                className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color || '#6366f1' }} />
                      <h3 className="font-bold text-sm text-white truncate">{p.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full">
                        {p.status}
                      </span>
                      {canManageProjects && (
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          title="Edit Project"
                          className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2">{p.description || 'No description provided.'}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-500 font-medium">Completion Progress</span>
                      <span className="text-white font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
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

      {/* Project Modal Component */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectSaved={fetchProjects}
        projectToEdit={selectedProject}
      />
    </div>
  );
}
