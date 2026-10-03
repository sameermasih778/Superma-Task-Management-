import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertCircle,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function TasksPage() {
  const { user, activeWorkspace } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role permissions
  const isViewer = user?.role === 'viewer';
  const canManageTasks = ['super_admin', 'admin', 'member'].includes(user?.role);

  // New Task Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [creating, setCreating] = useState(false);

  // Fetch Projects first
  useEffect(() => {
    const fetchProjects = async () => {
      if (!activeWorkspace?.id) return;
      try {
        const data = await api.get(`/projects?workspace_id=${activeWorkspace.id}`);
        const projs = data.projects || [];
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0].id.toString());
        }
      } catch (err) {
        console.warn('Fetch projects error:', err.message);
      }
    };
    fetchProjects();
  }, [activeWorkspace?.id]);

  // Fetch Tasks whenever selected project changes
  const fetchTasks = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      const data = await api.get(`/tasks?project_id=${selectedProjectId}`);
      setTasks(data.tasks || []);
    } catch (err) {
      console.warn('Fetch tasks error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedProjectId]);

  // Update Task Status (Kanban Board Move)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error('Task status update failed:', err.message);
    }
  };

  // Create Task Submission
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle || !selectedProjectId) return;
    setCreating(true);

    try {
      await api.post('/tasks', {
        project_id: parseInt(selectedProjectId, 10),
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        status: 'todo'
      });
      setNewTaskTitle('');
      setNewTaskDesc('');
      setShowCreateModal(false);
      fetchTasks();
    } catch (err) {
      console.error('Create task error:', err.message);
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-zinc-500' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-amber-500' },
    { id: 'in_review', title: 'In Review', color: 'bg-sky-500' },
    { id: 'done', title: 'Completed', color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-white" />
            Task Kanban Board
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Drag and drop tasks or switch status categories in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Dropdown Selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                Project: {p.name}
              </option>
            ))}
          </select>

          {canManageTasks ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1">
              Read-Only Client Mode
            </span>
          )}
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500 bg-zinc-950 border border-white/10 rounded-2xl">
          Loading task board from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const columnTasks = tasks.filter(t => t.status === col.id);

            return (
              <div key={col.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">{col.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-[11px] text-zinc-600">
                      Empty column
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-zinc-900/90 border border-white/10 p-4 rounded-xl space-y-3 shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-white leading-snug">{task.title}</h4>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                            task.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            task.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-zinc-400" />
                            <span>{task.assignee_name || 'Unassigned'}</span>
                          </div>

                          {/* Quick Status Change Selector */}
                          {canManageTasks ? (
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="bg-black border border-white/10 text-zinc-300 rounded px-1.5 py-0.5 text-[10px] focus:outline-none cursor-pointer"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="in_review">In Review</option>
                              <option value="done">Completed</option>
                            </select>
                          ) : (
                            <span className="text-[10px] text-zinc-500 font-mono capitalize">
                              {task.status.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Add New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement API Auth Middleware"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Task details and acceptance criteria..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl hover:bg-zinc-200"
                >
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
