import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Plus, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';

export default function DashboardHeader({ onToggleSidebar, onOpenNewTaskModal }) {
  const { user } = useAuth();
  const canManageTasks = ['super_admin', 'admin', 'member'].includes(user?.role);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl + K Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="h-16 bg-zinc-950/80 border-b border-white/10 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Mobile Menu Toggle & Global Search Trigger */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setIsSearchOpen(true)}
            className="relative max-w-md w-full hidden sm:flex items-center bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-400 hover:border-white/20 transition-all cursor-pointer justify-between group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              <span>Search projects, tasks, or team members...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-zinc-800 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
              Ctrl K
            </kbd>
          </div>
        </div>

      {/* Right Actions: New Task Button & Notifications Bell */}
      <div className="flex items-center gap-3">
        {canManageTasks && (
          <button
            onClick={onOpenNewTaskModal}
            className="bg-white text-black font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        )}

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBellDropdown(!showBellDropdown)}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {showBellDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-zinc-400 hover:text-white font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors ${
                        n.is_read ? 'opacity-70 bg-transparent' : 'bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{n.title}</span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px] line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  </>
  );
}
