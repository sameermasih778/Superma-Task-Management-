import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info, Zap, Command, Layers, SlidersHorizontal, User, CheckCircle2, MoreHorizontal, ChevronDown, ListFilter, CornerDownRight } from 'lucide-react';
import LogoStrip from './LogoStrip';
import smallLogo from '../assets/small logo.svg';
import usePublicNavOffset from '../hooks/usePublicNavOffset';

// The floating cards use negative top offsets to create the "peeking" effect
// (see the `-top-3` / `-top-4` classes below). Those cards are positioned
// relative to this section's content box, so they start CARD_OVERHANG_PX ABOVE
// where the content begins. If the section only clears the Navbar by less than
// that, the cards slide up underneath the Navbar and get clipped by it.
//
// Keep this in sync if the card offsets below are changed.
const CARD_OVERHANG_PX = 16; // -top-4
const NAVBAR_GAP_PX = 12; // breathing room below the Navbar

export default function Hero() {
  // The public Navbar is fixed and overlays this section. Measure its real
  // height instead of relying on pt-24/sm:pt-28/md:pt-32, which only cleared
  // it by ~12px at one width and would collide at others.
  const navOffset = usePublicNavOffset();

  return (
    <section
      style={{ paddingTop: navOffset ? navOffset + CARD_OVERHANG_PX + NAVBAR_GAP_PX : undefined }}
      className="relative pt-24 sm:pt-28 md:pt-32 pb-6 md:pb-10 overflow-hidden bg-black text-white min-h-[95vh] flex flex-col justify-between"
    >
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Studio Spotlights */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.03] rounded-full blur-[150px] pointer-events-none" />

      {/* Main Full-Width Container */}
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 relative z-10 flex-1 flex flex-col justify-between">
        
        {/* Floating Cards Canvas Layout */}
        <div className="relative w-full min-h-[560px] sm:min-h-[600px] lg:min-h-[640px] flex items-center justify-center my-auto">

          {/* ==================== LEFT FLOATING CARDS ==================== */}

          {/* 0. Left Background Peeking Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 0.25, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="hidden xl:block absolute -left-10 2xl:-left-4 -top-4 w-60 h-64 bg-[#0a0b0e] border border-white/[0.05] rounded-2xl p-4 shadow-2xl backdrop-blur-md pointer-events-none"
            style={{ transform: 'rotate(-7deg)' }}
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900/60 border border-white/5 mb-4" />
            <div className="space-y-2 opacity-40">
              <div className="h-3 w-16 bg-zinc-700/50 rounded" />
              <div className="h-2 w-32 bg-zinc-800/60 rounded" />
              <div className="h-2 w-24 bg-zinc-800/40 rounded" />
            </div>
          </motion.div>

          {/* 1. Top-Right of Left Cluster: Keyboard-first design */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.6, y: 0 }}
            whileHover={{ opacity: 0.95, scale: 1.02, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block absolute left-[4%] xl:left-[8%] 2xl:left-[12%] -top-3 w-56 bg-[#0c0d12]/90 border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-colors cursor-default"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-8 h-7 rounded-lg bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-400 text-xs shadow-inner">
                ⌘
              </div>
              <div className="w-8 h-7 rounded-lg bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-400 text-xs shadow-inner">
                ⌥
              </div>
              <div className="w-8 h-7 rounded-lg bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-400 text-xs shadow-inner">
                K
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/80 inline-block" />
              <h4 className="text-xs font-bold text-white tracking-tight">Keyboard-first design</h4>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">Shortcuts for everything - no mouse required</p>
          </motion.div>

          {/* 2. Middle-Left: Full Activity Log Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 0.65, x: 0 }}
            whileHover={{ opacity: 0.95, scale: 1.02, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden xl:block absolute -left-2 xl:left-2 2xl:left-6 top-[24%] w-[320px] 2xl:w-[340px] bg-[#0c0d12]/90 border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-colors cursor-default"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06]">
              <span className="text-[11px] font-semibold text-zinc-400 tracking-wider">Activity</span>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 cursor-pointer hover:text-zinc-300">
                <span>Unsubscribe</span>
                <User className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 flex-shrink-0" />
                <p><span className="text-zinc-200 font-medium">mode</span> created the issue <span className="text-zinc-500">• 8 days ago</span></p>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <p><span className="text-zinc-200 font-medium">mode</span> changed status from <span className="text-zinc-400">Todo</span> to <span className="text-emerald-400 font-medium">In progress</span> <span className="text-zinc-500">• 7 days ago</span></p>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <p><span className="text-zinc-200 font-medium">mode</span> set priority to <span className="text-amber-400 font-medium">Urgent</span></p>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <p><span className="text-zinc-200 font-medium">mode</span> self-assigned the issue</p>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 flex-shrink-0" />
                <p><span className="text-zinc-200 font-medium">mode</span> updated the description of the issue <span className="text-zinc-500">• 6 days ago</span></p>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                <p><span className="text-zinc-200 font-medium">mode</span> added labels <span className="text-zinc-500">•</span> <span className="text-zinc-300">Improvement</span> <span className="text-zinc-500">•</span> <span className="text-zinc-300">Bug</span> <span className="text-zinc-500">•</span> <span className="text-zinc-300">Feature</span></p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 text-[11px] text-zinc-500">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">M</div>
                <span>Leave a comment...</span>
              </div>
            </div>
          </motion.div>

          {/* 3. Bottom-Left: Productivity Reports Radial Gauges */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.65, y: 0 }}
            whileHover={{ opacity: 0.95, scale: 1.02, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:block absolute left-1 xl:left-4 2xl:left-8 bottom-0 w-[300px] 2xl:w-[320px] bg-[#0c0d12]/90 border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-colors cursor-default"
            style={{ transform: 'rotate(1deg)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">Productivity Reports</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-md px-1.5 py-0.5 text-[10px] text-zinc-400">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-sm" />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-sm" />
                </div>
                <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-md px-2 py-0.5 text-[10px] text-zinc-300">
                  <span>View</span>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center pt-1">
              {/* Gauge 1 */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" className="text-zinc-800" fill="transparent" strokeDasharray="4 4" />
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" className="text-emerald-400" strokeDasharray="201" strokeDashoffset="40" strokeLinecap="round" fill="transparent" />
                  </svg>
                  <div className="absolute text-center flex flex-col items-center justify-center">
                    <span className="text-base font-extrabold text-white">80%</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-zinc-300 mt-1">Productivity</span>
                <span className="text-[9px] text-zinc-500">From Last Month</span>
              </div>

              {/* Gauge 2 */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" className="text-zinc-800" fill="transparent" strokeDasharray="4 4" />
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" className="text-emerald-400" strokeDasharray="201" strokeDashoffset="70" strokeLinecap="round" fill="transparent" />
                  </svg>
                  <div className="absolute text-center flex flex-col items-center justify-center">
                    <span className="text-base font-extrabold text-white">65%</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-zinc-300 mt-1">Productivity</span>
                <span className="text-[9px] text-zinc-500">From Last Week</span>
              </div>
            </div>
          </motion.div>


          {/* ==================== RIGHT FLOATING CARDS ==================== */}

          {/* 4. Top-Right: My Workspace Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.65, y: 0 }}
            whileHover={{ opacity: 0.95, scale: 1.02, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="hidden lg:block absolute right-[4%] xl:right-[8%] 2xl:right-[12%] -top-4 w-56 bg-[#0c0d12]/90 border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-10 transition-colors cursor-default"
            style={{ transform: 'rotate(1deg)' }}
          >
            <div className="text-[10px] text-zinc-500 font-medium mb-2">Your Teams</div>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                My Workspace
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </div>
            <div className="space-y-1 text-xs text-zinc-400">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-900/90 border border-white/5 text-white font-medium">
                <div className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">≡</div>
                <span>Issues</span>
              </div>
              <div className="pl-7 text-zinc-400 py-0.5 hover:text-white cursor-pointer transition-colors">Active</div>
              <div className="pl-7 text-zinc-400 py-0.5 hover:text-white cursor-pointer transition-colors">Backlog</div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-900/50 cursor-pointer transition-colors">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Projects</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-900/50 cursor-pointer transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Views</span>
              </div>
            </div>
          </motion.div>

          {/* 5. Middle-Left of Right: Instantly Fast Card (Angled Tilt, placed neatly between My Workspace and Keyboard card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.7, scale: 1 }}
            whileHover={{ opacity: 0.95, scale: 1.03, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="hidden xl:block absolute right-[8%] xl:right-[12%] 2xl:right-[13%] top-[48%] w-48 bg-[#0d0e14]/90 border border-white/[0.1] hover:border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-20 transition-colors cursor-default"
            style={{ transform: 'rotate(-5deg)' }}
          >
            <div className="w-11 h-11 rounded-xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-white mx-auto mb-2.5 shadow-lg shadow-black/40">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="text-center">
              <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-pink-500 fill-pink-500" /> Instantly fast
              </h4>
              <p className="text-[10px] text-zinc-400 leading-tight">
                Designed in pursuit of high-speed performance
              </p>
            </div>
          </motion.div>

          {/* 6. Middle-Right of Right: Keyboard-first design Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 0.55, x: 0 }}
            whileHover={{ opacity: 0.9, scale: 1.02, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="hidden lg:block absolute -right-2 xl:right-1 2xl:right-4 top-[30%] w-56 bg-[#0c0d12]/90 border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-10 transition-colors cursor-default"
            style={{ transform: 'rotate(2deg)' }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-8 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 text-xs shadow-inner">
                ⌘
              </div>
              <div className="w-8 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 text-xs shadow-inner">
                ⌥
              </div>
              <div className="w-8 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 text-xs shadow-inner">
                K
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/80 inline-block" />
              <h4 className="text-xs font-bold text-white tracking-tight">Keyboard-first design</h4>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">Shortcuts for everything - no mouse required</p>
          </motion.div>

          {/* 7. Bottom-Right: Productivity Reports Detailed Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.65, y: 0 }}
            whileHover={{ opacity: 0.95, scale: 1.02, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden md:block absolute right-1 xl:right-4 2xl:right-8 bottom-0 w-[330px] 2xl:w-[360px] bg-[#0c0d12]/90 border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-colors cursor-default"
            style={{ transform: 'rotate(-1deg)' }}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Productivity Reports</span>
                  <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">New</span>
                </div>
                <p className="text-[9px] text-zinc-500 mt-0.5">Lorem ipsum dolor sit amet, consectetur</p>
              </div>
            </div>

            <div className="flex gap-2 items-stretch mt-3">
              {/* Y Axis */}
              <div className="flex flex-col justify-between text-[8px] text-zinc-600 font-mono py-1 pr-1">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
              </div>

              {/* Chart Canvas with Grid */}
              <div className="flex-1 relative h-24 flex flex-col justify-between">
                {/* Horizontal Grid lines */}
                <div className="w-full border-b border-white/[0.04] h-0" />
                <div className="w-full border-b border-white/[0.04] h-0" />
                <div className="w-full border-b border-white/[0.04] h-0" />
                <div className="w-full border-b border-white/[0.04] h-0" />
                <div className="w-full border-b border-white/[0.04] h-0" />
                <div className="w-full border-b border-white/[0.04] h-0" />

                {/* SVG Graph Overlay */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 240 80" preserveAspectRatio="none">
                  <path
                    d="M 10 70 L 30 65 L 50 20 L 70 60 L 90 75 L 110 50 L 130 15 L 150 45 L 170 35 L 190 60 L 210 25 L 230 20"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Glowing data points */}
                  <circle cx="10" cy="70" r="2.5" fill="#10b981" />
                  <circle cx="30" cy="65" r="2.5" fill="#10b981" />
                  <circle cx="50" cy="20" r="3" fill="#10b981" />
                  <circle cx="70" cy="60" r="2.5" fill="#10b981" />
                  <circle cx="90" cy="75" r="2.5" fill="#10b981" />
                  <circle cx="110" cy="50" r="2.5" fill="#10b981" />
                  <circle cx="130" cy="15" r="3.5" fill="#10b981" />
                  <circle cx="150" cy="45" r="2.5" fill="#10b981" />
                  <circle cx="170" cy="35" r="2.5" fill="#10b981" />
                  <circle cx="190" cy="60" r="2.5" fill="#10b981" />
                  <circle cx="210" cy="25" r="2.5" fill="#10b981" />
                  <circle cx="230" cy="20" r="2.5" fill="#10b981" />
                </svg>
              </div>
            </div>

            {/* X Axis */}
            <div className="flex justify-between pl-6 text-[8px] text-zinc-500 mt-1.5 font-mono uppercase">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </motion.div>


          {/* ==================== CENTER HERO CONTENT ==================== */}

          <div className="text-center max-w-2xl mx-auto z-20 relative py-8">
            {/* Top Badge Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/15 text-xs font-medium text-white mb-6 hover:border-white/30 transition-all cursor-pointer shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <img src={smallLogo} alt="Suprema Logo" className="h-5 w-5 object-contain" />
              </div>
              <span className="text-sm sm:text-base font-semibold">Manage projects end-to-end</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-5 leading-[1.08] font-tight"
            >
              Plan and navigate <br />
              from idea to launch.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-lg mx-auto mb-7 leading-relaxed font-normal"
            >
              Create a clear roadmap, track progress, and smoothly guide your project from idea to successful launch.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex flex-col items-center gap-2.5"
            >
              <a href="#pricing">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3 text-sm font-bold text-black bg-white hover:bg-zinc-200 transition-all rounded-xl shadow-xl shadow-white/10 cursor-pointer"
                >
                  Get Started For Free
                </motion.button>
              </a>

              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium pt-0.5">
                <Info className="w-3.5 h-3.5 text-zinc-500" />
                <span>No credit card required</span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Embedded Logo Strip at bottom of Hero fold */}
        <div className="mt-4">
          <LogoStrip />
        </div>
      </div>
    </section>
  );
}

