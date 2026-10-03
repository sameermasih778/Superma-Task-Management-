import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Activity,
  LogOut,
  ChevronDown,
  Building2,
  Plus,
  Shield
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, activeWorkspace, switchWorkspace, logout } = useAuth();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { label: 'Tasks Board', path: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Teams', path: '/dashboard/teams', icon: Users },
    { label: 'Activity Feed', path: '/dashboard/activity', icon: Activity }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-zinc-950 border-r border-white/10 transition-transform duration-300 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        {/* Top Brand Header & Workspace Switcher */}
        <div className="p-4 border-b border-white/10 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-sm shadow-md">
                S
              </div>
              <span className="font-bold tracking-tight text-white text-base">Suprema OS</span>
            </div>
            <span className="text-[10px] bg-white/10 border border-white/20 text-zinc-300 px-2 py-0.5 rounded-full font-semibold uppercase">
              {activeWorkspace?.plan || 'Free'}
            </span>
          </div>

          {/* Workspace Selector Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              className="w-full bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-left text-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Building2 className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="font-semibold text-white truncate">
                  {activeWorkspace?.name || 'Select Workspace'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showWorkspaceDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Workspace Dropdown Menu */}
            {showWorkspaceDropdown && (
              <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 p-1">
                <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Your Workspaces
                </div>
                {user?.workspaces?.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      switchWorkspace(ws);
                      setShowWorkspaceDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      activeWorkspace?.id === ws.id
                        ? 'bg-white text-black font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="truncate">{ws.name}</span>
                    <span className="text-[9px] opacity-75 uppercase">{ws.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-white/5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
              alt={user?.name}
              className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0 object-cover"
            />
            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 capitalize">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>{user?.role || 'member'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
