import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, LifeBuoy, LayoutDashboard, ArrowLeft,
  Sparkles, FileText, History, Clock, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RollText from '../components/RollText';
import smallLogo from '../assets/small logo.svg';

/**
 * 404 - Not Found Page.
 *
 * Styled and animated to match Suprema's signature dark luxury aesthetics,
 * featuring floating ambient orbs, the floating Suprema shield, staggered
 * blurred entrance transitions, interactive micro-animations, and quick navigation.
 */
export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = '404 | Page Not Found — Suprema';

    // Keep 404 pages out of search engine indexing
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, follow';
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <div className="relative bg-black text-white overflow-hidden font-tight min-h-screen flex items-center justify-center px-4 sm:px-6 pt-28 sm:pt-36 pb-20 selection:bg-white selection:text-black">

      {/* ==================== 1. ANIMATED AMBIENT BACKGROUND ==================== */}

      {/* Floating Animated Ambient Glow Orbs (matching LoginPage & Hero) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.28, 0.15],
          x: [0, 35, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-600/[0.12] blur-[150px] rounded-full pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.22, 0.1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-[500px] h-[350px] bg-indigo-500/[0.1] blur-[140px] rounded-full pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-blue-600/[0.08] blur-[130px] rounded-full pointer-events-none"
      />

      {/* Studio Top Spotlights */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Dot Grid Backdrop with Smooth Radial Fade Mask */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ==================== 2. MAIN 404 CONTENT CARD ==================== */}
      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">

        {/* Floating Suprema Shield Graphic (matches Waitlist & Blog hero) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', y: -15 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center mb-5"
        >
          {/* Ambient Glow behind shield */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-40 h-32 sm:h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Micro Grid Halo */}
          <div
            className="absolute -inset-6 sm:-inset-8 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
            }}
          />

          {/* Floating Logo with continuous gentle bob */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={smallLogo}
              alt="Suprema Shield"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
          </motion.div>
        </motion.div>

        {/* Top Status Badge Pill with Sparkles */}
        <motion.div
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm font-semibold text-purple-400 mb-6 shadow-sm backdrop-blur-md cursor-default select-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Error 404 • Destination Unknown</span>
        </motion.div>

        {/* Massive 404 Display with Subtle Gradient & Ambient Glow */}
        <div className="relative">
          {/* Backlight behind 404 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 h-20 bg-white/10 blur-3xl rounded-full pointer-events-none" />

          <motion.h1
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            aria-label="Error 404"
            className="select-none font-tight font-extrabold tracking-tight leading-none text-[84px] sm:text-[110px] md:text-[130px] bg-gradient-to-b from-white via-zinc-200 to-zinc-500/70 bg-clip-text text-transparent drop-shadow-2xl"
          >
            404
          </motion.h1>
        </div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-2 font-tight font-bold text-white leading-tight text-[28px] sm:text-[38px] md:text-[46px]"
        >
          Oops, page not found
        </motion.h2>

        {/* Subtitle / Descriptive Body */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-4 mx-auto max-w-lg font-tight text-[15px] sm:text-[17px] font-medium leading-relaxed text-zinc-400"
        >
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved,
          renamed, or never existed in the workspace. Let&apos;s get you back on track.
        </motion.p>

        {/* ==================== 3. ACTION BUTTONS ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          {/* Back to Home CTA */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              to="/"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-7 font-tight text-sm sm:text-base font-semibold text-black bg-white hover:bg-zinc-200 transition-all rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <RollText>Back to Home</RollText>
            </Link>
          </motion.div>

          {/* Contact Support */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              to="/contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-7 font-tight text-sm sm:text-base font-semibold text-white bg-zinc-900/90 border border-white/10 hover:border-white/20 hover:bg-zinc-800/90 transition-all rounded-xl backdrop-blur-md"
            >
              <LifeBuoy className="w-4 h-4 text-indigo-400" />
              <RollText>Contact Support</RollText>
            </Link>
          </motion.div>

          {/* Conditional Dashboard Button */}
          {isAuthenticated && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to="/dashboard"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-7 font-tight text-sm sm:text-base font-semibold text-white bg-zinc-900/90 border border-white/10 hover:border-white/20 hover:bg-zinc-800/90 transition-all rounded-xl backdrop-blur-md"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <RollText>Go to Dashboard</RollText>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* ==================== 4. HELPFUL SHORTCUTS BAR ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-12 w-full max-w-xl bg-zinc-950/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl"
        >
          <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mb-3">
            Quick Navigation Links
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-zinc-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 hover:border-white/20 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <Home className="w-3.5 h-3.5 text-zinc-500" />
              <span>Home</span>
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 hover:border-white/20 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <span>Blogs</span>
            </Link>
            <Link
              to="/changelog"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 hover:border-white/20 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <History className="w-3.5 h-3.5 text-zinc-500" />
              <span>Changelog</span>
            </Link>
            <Link
              to="/waitlist"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 hover:border-white/20 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Waitlist</span>
            </Link>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 hover:border-white/20 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Privacy</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
