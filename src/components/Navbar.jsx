import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  const navItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Blogs', href: '/blogs', isRoute: true },
    { name: 'Changelog', href: '/changelog', isRoute: true },
    { name: 'Waitlist', href: '/waitlist', isRoute: true },
  ];

  const handleSignOut = () => {
    const isStaff = sessionStorage.getItem('suprema_login_type') === 'admin' || 
                    localStorage.getItem('suprema_last_login_type') === 'admin' || 
                    ['super_admin', 'admin', 'developer'].includes(user?.role);
    logout();
    setMobileMenuOpen(false);
    if (isStaff) {
      navigate('/admin-login');
    } else {
      navigate('/login');
    }
  };

  return (
    <header data-public-navbar className="fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6 px-3 sm:px-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-5xl w-full bg-black/95 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-xl shadow-2xl flex flex-col transition-all">
        
        <div className="flex items-center justify-between w-full">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2 pl-2 sm:pl-3 group">
            <div className="flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
              <img src={logoImg} alt="Suprema Logo" className="h-12 sm:h-12 w-auto object-contain" />
            </div>
          </Link>

          {/* Center: Segmented Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center bg-zinc-900/90 border border-white/10 rounded-2xl p-1.5">
            {navItems.map((item) => {
              const isActive =
                (item.name === 'Home' && location.pathname === '/') ||
                (item.name === 'Blogs' && (location.pathname.startsWith('/blog') || location.pathname.startsWith('/blogs'))) ||
                (location.pathname === item.href);
              
              return item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={`relative px-5 lg:px-6 py-2.5 text-[15px] leading-none font-medium tracking-[-0.005em] transition-colors rounded-[10px] ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-zinc-800 rounded-[10px] border border-white/10 shadow-sm"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={`relative px-5 lg:px-6 py-2.5 text-[15px] leading-none font-medium tracking-[-0.005em] transition-colors rounded-[10px] ${
                    activeTab === item.name ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {activeTab === item.name && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-zinc-800 rounded-[10px] border border-white/10 shadow-sm"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right: Auth Action Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Secondary action - shown only outside the app itself */}
                {!isDashboardRoute && (
                  <Link to="/dashboard" className="hidden md:block">
                    <button className="flex items-center justify-center gap-2 h-11 px-5 sm:px-6 text-sm sm:text-base font-bold text-white bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all rounded-xl cursor-pointer whitespace-nowrap shadow-sm">
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                      <span>Dashboard</span>
                    </button>
                  </Link>
                )}

                {/* Sign Out - white button with label, as before */}
                <button
                  onClick={handleSignOut}
                  className="hidden md:flex items-center justify-center gap-1.5 h-11 px-5 sm:px-6 text-sm sm:text-base font-bold text-black bg-white hover:bg-zinc-200 transition-all rounded-xl shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  {/* Identical height/padding to the white Contact us button -
                      the two CTA buttons must sit on one optical baseline. */}
                  <button className="flex items-center justify-center h-11 px-5 sm:px-6 text-sm sm:text-base font-bold text-white bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all rounded-xl cursor-pointer whitespace-nowrap">
                    Sign In
                  </button>
                </Link>
                <Link to="/contact" className="hidden md:block">
                  <button className="px-5 py-2.5 sm:px-6 sm:py-2.5 text-sm sm:text-base font-bold text-black bg-white hover:bg-zinc-200 transition-all rounded-xl shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
                    Contact us
                  </button>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pt-3 border-t border-white/10 mt-2"
            >
              <div className="flex flex-col gap-1 p-1 bg-zinc-950/90 rounded-xl border border-white/10">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      setActiveTab(item.name);
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}

                <div className="pt-2 mt-1 border-t border-white/10 space-y-2">
                  {isAuthenticated ? (
                    <>
                      {!isDashboardRoute && (
                        <Link
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 text-sm font-bold text-black bg-white hover:bg-zinc-200 rounded-lg transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-2.5 text-sm font-bold text-black bg-white hover:bg-zinc-200 rounded-lg transition-all active:scale-95"
                      >
                        Contact us
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
