import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import usePublicNavOffset from '../../hooks/usePublicNavOffset';
import { getAvatarUrl } from '../../utils/avatar';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Activity,
  LogOut,
  ChevronDown,
  Building2,
  Globe,
  Shield,
  UserCog,
  Settings
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, activeWorkspace, switchWorkspace, logout } = useAuth();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const navigate = useNavigate();

  const isStaffOrAdmin = ['super_admin', 'admin', 'developer'].includes(user?.role);

  // The sidebar is `position: fixed`, so it ignores the DashboardLayout top
  // padding and would slide underneath the public Navbar (also fixed, z-50) on
  // member accounts. Staff portals render no Navbar, so this resolves to 0 and
  // the sidebar correctly stays at top-0 with full height.
  const navOffset = usePublicNavOffset();

  const handleLogout = () => {
    const isStaff = sessionStorage.getItem('suprema_login_type') === 'admin' || 
                    localStorage.getItem('suprema_last_login_type') === 'admin' || 
                    ['super_admin', 'admin', 'developer'].includes(user?.role);
    logout();
    if (isStaff) {
      navigate('/admin-login');
    } else {
      navigate('/login');
    }
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { label: 'Tasks Board', path: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Teams', path: '/dashboard/teams', icon: Users },
    { label: 'Activity Feed', path: '/dashboard/activity', icon: Activity },
    // Staff use a fixed role emblem and have no picture to change, so the
    // Profile page is only offered to member / viewer accounts.
    ...(!isStaffOrAdmin ? [{ label: 'My Profile', path: '/dashboard/profile', icon: Settings }] : []),
    ...(isStaffOrAdmin ? [{ label: 'User Management', path: '/dashboard/users', icon: UserCog }] : [])
  ];

  return (
    <aside
      style={navOffset ? { top: navOffset, height: `calc(100vh - ${navOffset}px)` } : undefined}
      className={`fixed left-0 z-40 w-64 bg-zinc-950 border-r border-white/10 transition-transform duration-300 flex flex-col justify-between ${
        navOffset ? '' : 'top-0 h-screen'
      } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
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

          {/* EXCLUSIVE FOR ADMIN & DEVELOPER LOGIN: Public Link Button */}
          {isStaffOrAdmin && (
            <div className="pt-2 mt-2 border-t border-white/10">
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-indigo-400 hover:text-white hover:bg-indigo-500/10 transition-all border border-indigo-500/20"
              >
                <Globe className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                <span>Public Link</span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-white/5">
          {/* Members can click their name to reach Profile Settings. Staff have
              no picture to change, so theirs is a static identity block. */}
          {isStaffOrAdmin ? (
            <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden px-1 py-0.5">
              <img
                src={getAvatarUrl(user)}
                alt={user?.name}
                className="h-8 w-8 flex-shrink-0 rounded-full border border-white/10 bg-zinc-800 object-cover"
              />
              <div className="min-w-0 overflow-hidden text-left">
                <p className="truncate text-xs font-bold text-white">{user?.name || 'User'}</p>
                <div className="flex items-center gap-1 text-[10px] capitalize text-zinc-400">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <span>{user?.role || 'member'}</span>
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              title="Profile settings"
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-white/5"
            >
              <img
                src={getAvatarUrl(user)}
                alt={user?.name}
                className="h-8 w-8 flex-shrink-0 rounded-full border border-white/10 bg-zinc-800 object-cover"
              />
              <div className="min-w-0 overflow-hidden text-left">
                <p className="truncate text-xs font-bold text-white">{user?.name || 'User'}</p>
                <div className="flex items-center gap-1 text-[10px] capitalize text-zinc-400">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <span>{user?.role || 'member'}</span>
                </div>
              </div>
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            title="Log Out"
            aria-label="Log out"
            className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
