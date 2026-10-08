import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  Calendar
} from 'lucide-react';
import TaskDetailDrawer from '../components/dashboard/TaskDetailDrawer';

export default function TasksPage() {
  const { user, activeWorkspace } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Drawer & Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // The create/edit modal is owned by DashboardLayout so the header's "New Task"
  // button works from every page. This page only opens it and reacts to the
  // result.
  const { setIsNewTaskModalOpen, setEditingTask, setNewTaskProjectId } = useOutletContext() || {};

  // Dragging state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Permissions
  const canManage = ['super_admin', 'admin', 'member'].includes(user?.role);

  // Fetch Projects on Workspace Change
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

  // Fetch Tasks for Selected Project
  const fetchTasks = useCallback(async () => {
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
  }, [selectedProjectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Status Change (Kanban Drop or Dropdown change)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error('Task status update failed:', err.message);
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    handleStatusChange(draggedTaskId, targetStatus);
    setDraggedTaskId(null);
  };

  // Delete Task
  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Delete task error:', err.message);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task, e) => {
    e.stopPropagation();
    setEditingTask(task);
    // Pre-select the project this task already belongs to, so the selector
    // reflects reality instead of starting blank.
    setNewTaskProjectId(task.project_id ? String(task.project_id) : null);
    setIsNewTaskModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsNewTaskModalOpen(true);
  };

  // Filter Tasks by Search & Priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-zinc-500', border: 'border-zinc-500/30' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-amber-500', border: 'border-amber-500/30' },
    { id: 'in_review', title: 'In Review', color: 'bg-sky-500', border: 'border-sky-500/30' },
    { id: 'done', title: 'Completed', color: 'bg-emerald-500', border: 'border-emerald-500/30' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar: Header Title & Control Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-white" />
            Task Kanban Board
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Drag and drop task cards, click to view comments & attachments, or update statuses in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Project Switcher */}
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  Project: {p.name}
                </option>
              ))}
            </select>
          </div>

          {canManage ? (
            <button
              onClick={handleOpenCreate}
              className="bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl">
              Read-Only Mode
            </span>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950 border border-white/10 p-3 rounded-2xl">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Filter Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-zinc-500 bg-zinc-950 border border-white/10 rounded-2xl">
          Loading project tasks from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 flex flex-col min-h-[550px] transition-colors"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">{col.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-zinc-400 bg-zinc-900 border border-white/10 px-2 py-0.5 rounded-lg">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-3 flex-1">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-[11px] text-zinc-600 font-medium">
                      Drop tasks here
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        draggable={canManage}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        whileHover={{ y: -2 }}
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDrawerOpen(true);
                        }}
                        className="bg-zinc-900/90 border border-white/10 hover:border-white/25 p-4 rounded-xl space-y-3 shadow-lg cursor-pointer transition-all relative group"
                      >
                        {/* Title & Priority Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-white leading-snug group-hover:text-indigo-300 transition-colors">
                            {task.title}
                          </h4>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            task.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            task.priority === 'medium' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Assignee & Actions Footer */}
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-zinc-300 font-medium truncate max-w-[100px]">
                              {task.assignee_name || 'Unassigned'}
                            </span>
                          </div>

                          {/* Action Buttons: Edit / Delete */}
                          {canManage && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleOpenEdit(task, e)}
                                className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                                title="Edit Task"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="p-1 text-zinc-400 hover:text-red-400 rounded hover:bg-red-500/10"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onTaskUpdated={fetchTasks}
      />

      {/* The create/edit modal itself is rendered by DashboardLayout. This page
          only needs to know when a task was created so it can refetch. */}
      <TaskCreatedListener onCreated={fetchTasks} />
    </div>
  );
}

/**
 * Subscribes to the "suprema:tasks-changed" event that DashboardLayout fires
 * after a task is created from the header button.
 *
 * Kept as a tiny component so the effect is cleaned up with the page instead
 * of leaking a window listener on every mount.
 */
function TaskCreatedListener({ onCreated }) {
  useEffect(() => {
    const handler = () => onCreated();
    window.addEventListener('suprema:tasks-changed', handler);
    return () => window.removeEventListener('suprema:tasks-changed', handler);
  }, [onCreated]);

  return null;
}
