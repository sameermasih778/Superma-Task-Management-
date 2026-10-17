import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { 
  BarChart3, 
  Check, 
  Bell, 
  SlidersHorizontal,
  Plus,
  Users,
  GitBranch,
  Layers,
  Folder
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

  const reduced = useReducedMotion();

  // The first block is pinned for ~600px of scroll. Without something moving
  // during that hold the pin reads as a "dead zone" where the page looks
  // frozen. So the pinned mockup is driven by scroll progress: the completion
  // bar fills and a coloured wash wipes left-to-right across each timeline bar
  // in turn. The bars themselves stay visible at all times - only the wash is
  // clipped - so the mockup is never blank before the pin begins.
  //
  // The offset is deliberately aligned to the pin itself. With the column
  // stuck at `top: 20vh` inside a `150vh` grid, the pin runs from the grid's
  // top reaching 20% of the viewport to its bottom reaching 85% - progress is
  // 0 at the start of the hold and 1 the moment it releases.
  const gridRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start 20%', 'end 85%'],
  });

  const HIDDEN = 'inset(0% 100% 0% 0%)';
  const SHOWN = 'inset(0% 0% 0% 0%)';

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const progressLabel = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  // Sequential wipe-in, each bar handing over to the next.
  const bar1 = useTransform(scrollYProgress, [0.04, 0.28], [HIDDEN, SHOWN]);
  const bar2 = useTransform(scrollYProgress, [0.28, 0.5], [HIDDEN, SHOWN]);
  const bar3 = useTransform(scrollYProgress, [0.5, 0.72], [HIDDEN, SHOWN]);
  const bar4 = useTransform(scrollYProgress, [0.72, 0.96], [HIDDEN, SHOWN]);

  // The "Assign Task" pill rises slightly at the end, as if the work is
  // complete. It stays fully visible throughout (never opacity 0), so the
  // mockup never looks like it is missing a piece.
  const pillY = useTransform(scrollYProgress, [0.78, 0.98], [14, 0]);

  const reveal = (mv) => (reduced ? { clipPath: SHOWN } : { clipPath: mv });

  return (
    <section id="progress-tools" className="py-24 md:py-32 bg-black text-white relative overflow-clip border-t border-white/10">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-32">
        
        {/* ==================== BLOCK 1: PROGRESS TRACKING ====================
            Pinned on lg+ (matches the reference site, which pins this exact
            "Monitor Progress Faster Than Ever." headline): the row holds near the
            top of the viewport while the page keeps scrolling, and the extra
            `lg:h-[150vh]` on the grid supplies that scroll distance.
            A pin with nothing to show for it just looks frozen, so the mockup is
            scroll-linked: the completion bar fills and the four timeline bars
            wipe in one after the other across the hold (see `scrollYProgress`).
            NOTE: the <section> uses `overflow-clip`, not `overflow-hidden`, because
            `overflow-hidden` creates a scroll container that traps `position: sticky`. */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center lg:items-start lg:h-[150vh]"
        >
          
          {/* Left Text & Stats Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 lg:sticky lg:top-[20vh]"
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
            className="lg:col-span-6 lg:sticky lg:top-[20vh]"
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

              {/* Scroll-linked completion bar: this is what the pin exists for.
                  It fills across the pinned scroll, so the hold shows motion
                  instead of looking frozen. */}
              <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Completion
                </span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    style={reduced ? { width: '100%' } : { width: progressWidth }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-purple-500"
                  />
                </div>
                <motion.span className="text-[10px] font-mono text-amber-400 w-9 text-right">
                  {reduced ? '100%' : progressLabel}
                </motion.span>
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

              {/* Gantt Timeline Task Rows. Each bar stays visible at all times;
                  the scroll-driven wash wipes across it as the section is
                  pinned, so the mockup is never blank before the pin starts. */}
              <div className="space-y-4 mb-6">
                
                {/* Task Bar 1 */}
                <div className="relative">
                  <div className="relative overflow-hidden w-[60%] bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 shadow-md">
                    <motion.div
                      aria-hidden="true"
                      style={reveal(bar1)}
                      className="absolute inset-0 bg-amber-500/25 pointer-events-none"
                    />
                    <div className="relative font-semibold text-white">Design & Development</div>
                    <div className="relative text-[9px] text-amber-400 font-mono">Jan 02 to Apr 04</div>
                  </div>
                </div>

                {/* Task Bar 2 */}
                <div className="relative flex justify-center">
                  <div className="relative overflow-hidden w-[65%] ml-auto bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5 text-xs text-blue-300 shadow-md">
                    <motion.div
                      aria-hidden="true"
                      style={reveal(bar2)}
                      className="absolute inset-0 bg-blue-500/25 pointer-events-none"
                    />
                    <div className="relative font-semibold text-white">Prototyping & Wireframing</div>
                    <div className="relative text-[9px] text-blue-400 font-mono">May 17 to Aug 03</div>
                  </div>
                </div>

                {/* Task Bar 3 */}
                <div className="relative">
                  <div className="relative overflow-hidden w-[50%] bg-purple-500/10 border border-purple-500/30 rounded-xl p-2.5 text-xs text-purple-300 shadow-md">
                    <motion.div
                      aria-hidden="true"
                      style={reveal(bar3)}
                      className="absolute inset-0 bg-purple-500/25 pointer-events-none"
                    />
                    <div className="relative font-semibold text-white">Web Maintenance</div>
                    <div className="relative text-[9px] text-purple-400 font-mono">Jan 02 to Jun 01</div>
                  </div>
                </div>

                {/* Task Bar 4 */}
                <div className="relative flex justify-end">
                  <div className="relative overflow-hidden w-[45%] bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-300 shadow-md">
                    <motion.div
                      aria-hidden="true"
                      style={reveal(bar4)}
                      className="absolute inset-0 bg-emerald-500/25 pointer-events-none"
                    />
                    <div className="relative font-semibold text-white">Deployment & Hosting</div>
                    <div className="relative text-[9px] text-emerald-400 font-mono">Jul 10 to Sep 04</div>
                  </div>
                </div>

              </div>

              {/* Floating Bottom Assignee Action Pill - rises as the pin
                  finishes, so the hold ends on a completed state. */}
              <div className="flex items-center justify-center pt-2">
                <motion.div
                  style={reduced ? undefined : { y: pillY }}
                  className="inline-flex items-center gap-3 bg-zinc-900/90 border border-white/15 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md"
                >
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
                </motion.div>
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
