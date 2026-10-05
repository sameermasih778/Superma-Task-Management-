import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Terminal } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function AdminNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6 px-3 sm:px-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-5xl w-full bg-zinc-950/95 border border-indigo-500/20 rounded-2xl p-3 sm:p-4 backdrop-blur-xl shadow-2xl flex items-center justify-between transition-all">
        
        {/* Left: Brand Logo & Internal Badge */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImg} alt="Suprema Logo" className="h-10 sm:h-11 w-auto object-contain" />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin & Developer Portal</span>
          </div>
        </div>

        {/* Center: System Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-400 font-mono">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Internal Auth v1.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* Right: Return to Public Site Link */}
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Public Site</span>
        </Link>

      </div>
    </header>
  );
}
