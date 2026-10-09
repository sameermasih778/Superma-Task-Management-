import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  FolderKanban,
  User,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import TaskDetailDrawer from '../components/dashboard/TaskDetailDrawer';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { activeWorkspace } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [loading, setLoading] = useState(true);

  // Task Drawer State
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch Projects and Tasks
  const fetchData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects?workspace_id=${activeWorkspace.id}`),
        api.get(`/tasks?workspace_id=${activeWorkspace.id}`)
      ]);
      setProjects(projRes.projects || []);
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      console.warn('Failed to load calendar data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeWorkspace?.id]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // First day of current month (0-6)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in current month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  // Total days in previous month
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter tasks by selected project
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (selectedProjectId !== 'all' && t.project_id.toString() !== selectedProjectId) {
        return false;
      }
      return true;
    });
  }, [tasks, selectedProjectId]);

  // Map tasks to dates: { "YYYY-MM-DD": [tasks] }
  const tasksByDate = useMemo(() => {
    const map = {};
    filteredTasks.forEach(t => {
      if (!t.due_date) return;
      const dateStr = t.due_date.substring(0, 10);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(t);
    });
    return map;
  }, [filteredTasks]);

  // Priority badge helper
  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-500/10 text-red-300';
      case 'high': return 'border-l-amber-500 bg-amber-500/10 text-amber-300';
      case 'medium': return 'border-l-indigo-500 bg-indigo-500/10 text-indigo-300';
      default: return 'border-l-zinc-500 bg-zinc-800/40 text-zinc-300';
    }
  };

  // Generate calendar grid cells (42 cells: 6 rows of 7 days)
  const calendarDays = useMemo(() => {
    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, d);
      const dateKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateKey,
        isCurrentMonth: false,
        tasks: tasksByDate[dateKey] || []
      });
    }

    // Current month days
    const todayStr = new Date().toISOString().substring(0, 10);
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === todayStr,
        tasks: tasksByDate[dateKey] || []
      });
    }

    // Next month filler days (to fill remaining cells up to 35 or 42)
    const remaining = (firstDayIndex + totalDaysInMonth) > 35 ? 42 - days.length : 35 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dateKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateKey,
        isCurrentMonth: false,
        tasks: tasksByDate[dateKey] || []
      });
    }

    return days;
  }, [year, month, firstDayIndex, totalDaysInMonth, prevMonthDays, tasksByDate]);

  // Overview stats for current month
  const monthStats = useMemo(() => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const thisMonthTasks = filteredTasks.filter(t => t.due_date && t.due_date.startsWith(monthPrefix));
    const completed = thisMonthTasks.filter(t => t.status === 'done').length;
    const todayStr = new Date().toISOString().substring(0, 10);
    const overdue = filteredTasks.filter(t => t.due_date && t.due_date.substring(0, 10) < todayStr && t.status !== 'done').length;

    return {
      total: thisMonthTasks.length,
      completed,
      overdue
    };
  }, [filteredTasks, year, month]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            Task Schedule & Calendar
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Visual roadmap of task delivery dates, sprint milestones, and deadlines across {activeWorkspace?.name || 'Workspace'}.
          </p>
        </div>

        {/* Month Navigation & Controls */}
        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <FolderKanban className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-zinc-900 text-white">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id.toString()} className="bg-zinc-900 text-white">{p.name}</option>
              ))}
            </select>
          </div>

          {/* Month Stepper */}
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl overflow-hidden p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Summary Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Current Period</span>
            <span className="text-sm font-bold text-white">{monthName} {year}</span>
          </div>
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="p-3 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Due This Month</span>
            <span className="text-sm font-bold text-white">{monthStats.total} Tasks</span>
          </div>
          <Clock className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-3 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Completed</span>
            <span className="text-sm font-bold text-emerald-400">{monthStats.completed} Tasks</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-3 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Overdue Deadlines</span>
            <span className="text-sm font-bold text-red-400">{monthStats.overdue} Tasks</span>
          </div>
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-zinc-900/50 text-center text-xs font-bold text-zinc-400 py-3">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="uppercase tracking-wider text-[11px]">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-white/5 bg-zinc-950">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[120px] p-2 flex flex-col justify-between transition-colors ${
                day.isCurrentMonth ? 'bg-zinc-950/60' : 'bg-zinc-900/20 opacity-50'
              } ${day.isToday ? 'ring-1 ring-inset ring-indigo-500/50 bg-indigo-950/10' : ''}`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                    day.isToday
                      ? 'bg-indigo-600 text-white font-black'
                      : day.isCurrentMonth
                      ? 'text-zinc-300'
                      : 'text-zinc-600'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {day.tasks.length > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-400">
                    {day.tasks.length}
                  </span>
                )}
              </div>

              {/* Day tasks cards */}
              <div className="space-y-1 flex-1 overflow-y-auto max-h-[85px] scrollbar-none">
                {day.tasks.slice(0, 3).map((task) => {
                  const isDone = task.status === 'done';
                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsDrawerOpen(true);
                      }}
                      className={`p-1.5 rounded-lg border-l-2 text-[10px] font-semibold cursor-pointer truncate transition-all ${getPriorityBorder(
                        task.priority
                      )} ${isDone ? 'opacity-50 line-through' : ''}`}
                      title={`${task.title} (${task.priority} priority)`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{task.title}</span>
                      </div>
                    </motion.div>
                  );
                })}

                {day.tasks.length > 3 && (
                  <div
                    onClick={() => {
                      setSelectedTask(day.tasks[3]);
                      setIsDrawerOpen(true);
                    }}
                    className="text-[9px] font-bold text-zinc-500 hover:text-white cursor-pointer pl-1"
                  >
                    +{day.tasks.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onTaskUpdated={fetchData}
      />
    </div>
  );
}
