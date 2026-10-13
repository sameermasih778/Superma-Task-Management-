import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Check, 
  Sparkles, 
  Bell, 
  Search, 
  SlidersHorizontal,
  Plus,
  Users,
  GitBranch,
  Layers,
  Folder,
  ChevronRight
} from 'lucide-react';

export default function ProgressAndTools() {
  const checklist = [
    'Easily sort tasks by priority and status.',
    'Organize tasks with customizable labels for quick reference.',
    'Use visual labels to distinguish task categories.',
    'Quickly find tasks using the advanced search function.',
  ];

  const filterChipsRow1 = ['Status', 'Assignee', 'Creator', 'Priority', 'Labels'];
  const filterChipsRow2 = ['Content', 'Project', 'Project status', 'Roadmap'];

  return (
    <section id="progress-tools" className="py-24 md:py-32 bg-black text-white relative overflow-hidden border-t border-white/10">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-32">
        
        {/* ==================== BLOCK 1: PROGRESS TRACKING ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text & Stats Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-6">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Progress Tracking</span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-5 font-tight leading-[1.1]">
              Monitor Progress <br />
              Faster Than Ever.
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal mb-8 max-w-lg">
              Instantly access real-time updates to track project progress and make quick adjustments.
            </p>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-8 my-8 pb-4">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-tight mb-1">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-zinc-400 font-medium">
                  Increase in Progress Tracking
                </div>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-tight mb-1">
                  10X
                </div>
                <div className="text-xs sm:text-sm text-zinc-400 font-medium">
                  Increase in Productivity
                </div>
              </div>
            </div>

            {/* CTA Button */}

            <Link to="/contact">
              <button className="px-7 py-3.5 text-sm font-bold text-black bg-white hover:bg-zinc-200 transition-all rounded-xl shadow-xl shadow-white/10 active:scale-95 cursor-pointer">
                Start your 7 day free trial
              </button>
            </Link>
          </motion.div>

          {/* Right Project Timeline UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="bg-[#09090b] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                    📅
                  </div>
                  <span className="text-xs font-bold text-white">Project Timeline</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Bell className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                  <SlidersHorizontal className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Timeline Months Bar */}
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono border-b border-white/5 pb-3 mb-5 px-1">
                <span>JAN</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
                <span>MAY</span>
                <span>JUN</span>
                <span>JUL</span>
                <span>AUG</span>
                <span>SEP</span>
              </div>

              {/* Gantt Timeline Task Rows */}
              <div className="space-y-4 mb-6">
                
                {/* Task Bar 1 */}
                <div className="relative">
                  <div className="w-[60%] bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 shadow-md">
                    <div className="font-semibold text-white">Design & Development</div>
                    <div className="text-[9px] text-amber-400 font-mono">Jan 02 to Apr 04</div>
                  </div>
                </div>

                {/* Task Bar 2 */}
                <div className="relative flex justify-center">
                  <div className="w-[65%] ml-auto bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5 text-xs text-blue-300 shadow-md">
                    <div className="font-semibold text-white">Prototyping & Wireframing</div>
                    <div className="text-[9px] text-blue-400 font-mono">May 17 to Aug 03</div>
                  </div>
                </div>

                {/* Task Bar 3 */}
                <div className="relative">
                  <div className="w-[50%] bg-purple-500/10 border border-purple-500/30 rounded-xl p-2.5 text-xs text-purple-300 shadow-md">
                    <div className="font-semibold text-white">Web Maintenance</div>
                    <div className="text-[9px] text-purple-400 font-mono">Jan 02 to Jun 01</div>
                  </div>
                </div>

                {/* Task Bar 4 */}
                <div className="relative flex justify-end">
                  <div className="w-[45%] bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-300 shadow-md">
                    <div className="font-semibold text-white">Deployment & Hosting</div>
                    <div className="text-[9px] text-emerald-400 font-mono">Jul 10 to Sep 04</div>
                  </div>
                </div>

              </div>

              {/* Floating Bottom Assignee Action Pill */}
              <div className="flex items-center justify-center pt-2">
                <div className="inline-flex items-center gap-3 bg-zinc-900/90 border border-white/15 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md">
                  <span className="text-xs font-semibold text-white">Assign Task</span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500 border border-black text-[9px] font-bold text-black flex items-center justify-center">
                      J
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-600 border border-black text-[9px] font-bold text-white flex items-center justify-center">
                      A
                    </div>
                    <div className="w-6 h-6 rounded-full bg-purple-600 border border-black text-[9px] font-bold text-white flex items-center justify-center">
                      S
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>


        {/* ==================== BLOCK 2: ORGANIZATIONAL TOOLS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8">
          
          {/* Left Sidebar Widgets UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 lg:order-1 order-2"
          >
            <div className="bg-[#09090b] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
              
              {/* Widgets Top Section */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Box 1: Favorites */}
                <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    <span>Favorites</span>
                    <span className="text-zinc-600">▾</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white">
                    <span className="text-zinc-500">::</span> Build in Public
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-zinc-600">::</span> Framer Portfolio
                  </div>
                </div>

                {/* Box 2: Your Teams */}
                <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    <span>Your teams</span>
                    <span className="text-zinc-600">▾</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white">
                    <span className="w-2 h-2 rounded bg-blue-500" /> Personal
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="w-2 h-2 rounded bg-purple-500" /> Templates
                  </div>
                </div>

                {/* Box 3: Try */}
                <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    <span>Try</span>
                    <span className="text-zinc-600">▾</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Plus className="w-3 h-3 text-zinc-500" /> Invite people
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="w-2 h-2 rounded-full border border-zinc-500" /> Cycles
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <GitBranch className="w-3 h-3 text-zinc-500" /> Link GitHub
                  </div>
                </div>

                {/* Box 4: Workspace */}
                <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    <span>Workspace</span>
                    <span className="text-zinc-600">▾</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Layers className="w-3 h-3 text-zinc-500" /> Views
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Folder className="w-3 h-3 text-zinc-500" /> Roadmaps
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Users className="w-3 h-3 text-zinc-500" /> Teams
                  </div>
                </div>

              </div>

              {/* Bottom Filter Chips Container */}
              <div className="bg-zinc-950/90 border border-white/5 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {filterChipsRow1.map((chip, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300 flex items-center gap-1.5"
                    >
                      <span className="text-zinc-400 text-[10px]">⚙</span>
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {filterChipsRow2.map((chip, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-zinc-900/60 border border-white/5 text-xs font-medium text-zinc-400 flex items-center gap-1.5"
                    >
                      <span className="text-zinc-400 text-[10px]">•</span>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Text & Bullet Items */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 lg:order-2 order-1"
          >
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Organizational Tools</span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-tight leading-[1.1]">
              Powerful Task <br />
              Management Tools
            </h2>

            {/* Checklist */}
            <ul className="space-y-4">
              {checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
