import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitFork, 
  Sun, 
  TrendingUp, 
  RotateCcw, 
  ChevronDown, 
  ArrowUpRight, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Folder,
  PieChart,
  Timer,
  Tag
} from 'lucide-react';

export default function FeatureShowcase() {
  const [activeProjectFilter, setActiveProjectFilter] = useState('Project 1');
  const [restoredTasks, setRestoredTasks] = useState([]);

  const toggleRestore = (taskId) => {
    if (restoredTasks.includes(taskId)) {
      setRestoredTasks(restoredTasks.filter(id => id !== taskId));
    } else {
      setRestoredTasks([...restoredTasks, taskId]);
    }
  };

  const secondaryFeatures = [
    {
      icon: Folder,
      title: 'File Sharing',
      description: 'Easily upload and share project files securely.',
    },
    {
      icon: PieChart,
      title: 'Team Sync',
      description: 'Keep your team aligned with real-time updates.',
    },
    {
      icon: Timer,
      title: 'Time Tracker',
      description: 'Log work hours directly within the platform.',
    },
    {
      icon: Tag,
      title: 'Task Tags',
      description: 'Organize tasks with customizable tags for quick filtering.',
    },
  ];

  return (
    <section id="features-showcase" className="py-20 md:py-28 bg-black text-white relative overflow-hidden border-t border-white/10">
      
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-emerald-600/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-400 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Intelligent Core Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-tight"
          >
            Everything you need for seamless execution
          </motion.h2>
        </div>

        {/* 2x2 Bento Grid Container with Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/10 rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl shadow-2xl mb-16 isolate">
          
          {/* ==================== CARD 1: Smart Task Assignment ==================== */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 lg:p-12 flex flex-col justify-between min-w-0 h-full border-white/10 max-md:border-b md:border-b md:border-r"
          >
            {/* Header Description */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-white mb-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center text-white">
                  <GitFork className="w-4 h-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Smart Task Assignment
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Automatically assign tasks based on project needs and team strengths.
              </p>
            </div>

            {/* UI Mockup Card */}
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 min-w-0 overflow-hidden">
              
              {/* Top Action Dropdown */}
              <div className="flex items-center justify-between bg-zinc-900/80 border border-white/10 rounded-xl p-3">
                <div>
                  <div className="text-xs font-semibold text-white">Action</div>
                  <div className="text-[11px] text-zinc-400">When a new task is added to this project</div>
                </div>
                <button className="flex items-center gap-1.5 bg-zinc-950 border border-white/15 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:text-white transition-colors">
                  <span>Assign to</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>

              {/* Inner Task Details Container */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-white">Apex Dashboard Design</div>

                {/* Assignee 1 */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-950/60 border border-white/5 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-[11px] font-bold flex-shrink-0">
                      J
                    </div>
                    <span className="text-xs font-semibold text-white truncate">Johnson</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                      Current
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono flex-shrink-0">Dec 16, 05:00 - 19:00</span>
                </div>

                {/* Assignee 2 */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-950/60 border border-white/5 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-[11px] font-bold flex-shrink-0">
                      E
                    </div>
                    <span className="text-xs font-semibold text-white truncate">Emelle</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono flex-shrink-0">Dec 20, 18:00 - 23:50</span>
                </div>
              </div>

            </div>
          </motion.div>


          {/* ==================== CARD 2: Customizable Task Prioritization ==================== */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 lg:p-12 flex flex-col justify-between min-w-0 h-full border-white/10 max-md:border-b md:border-b"
          >
            {/* Header Description */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-white mb-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center text-white">
                  <Sun className="w-4 h-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Customizable Task Prioritization
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Set task priorities to align with your goals and deadlines.
              </p>
            </div>

            {/* UI Mockup Card */}
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 min-w-0 overflow-hidden">
              
              {/* Header Bar with Progress Segment Gauges */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-white">Tasks Priorities</span>
                <span className="text-[11px] text-zinc-400 font-mono bg-zinc-900 border border-white/10 px-2 py-0.5 rounded">
                  04 / 12
                </span>
              </div>

              {/* Segmented Color Bar */}
              <div className="flex gap-1.5 py-1">
                <div className="h-2 flex-1 rounded-full bg-emerald-500" />
                <div className="h-2 flex-1 rounded-full bg-emerald-500" />
                <div className="h-2 flex-1 rounded-full bg-amber-400" />
                <div className="h-2 flex-1 rounded-full bg-zinc-800" />
              </div>

              {/* Sub-header Title */}
              <div className="text-xs font-semibold text-zinc-300 pt-1">
                Lander Studio Website Design
              </div>

              {/* Priority Items */}
              <div className="space-y-2.5">
                {/* Item 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[8px] text-emerald-400">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">Desktop Design</div>
                      <div className="text-[10px] text-emerald-400 font-medium">56.2%</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 bg-zinc-950 border border-white/15 text-zinc-300 px-2.5 py-1 rounded-lg text-[11px]">
                    <span>Assign to</span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500 flex items-center justify-center text-[8px] text-amber-400">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">Icon Changes</div>
                      <div className="text-[10px] text-amber-400 font-medium">20.0%</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 bg-zinc-950 border border-white/15 text-zinc-300 px-2.5 py-1 rounded-lg text-[11px]">
                    <span>Assign to</span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </div>

                {/* Item 3 (Faded) */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/20 border border-white/5 opacity-40">
                  <div className="text-xs text-zinc-400">Content Change</div>
                  <span className="text-[10px] text-zinc-500">14.0%</span>
                </div>
              </div>

            </div>
          </motion.div>


          {/* ==================== CARD 3: Track Progress Seamlessly ==================== */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 lg:p-12 flex flex-col justify-between min-w-0 h-full border-white/10 max-md:border-b md:border-r"
          >
            {/* Header Description */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-white mb-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center text-white">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Track Progress Seamlessly
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Monitor project updates and performance across teams in real time.
              </p>
            </div>

            {/* UI Mockup Card */}
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 min-w-0 overflow-hidden">
              
              {/* Header Row */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                    LS
                  </div>
                  <span className="text-xs font-bold text-white">Lander Studio</span>
                </div>
                <button className="flex items-center gap-1.5 bg-zinc-900 border border-white/15 text-zinc-300 px-2.5 py-1 rounded-lg text-[11px] hover:text-white transition-colors">
                  <span>Ref: Lander studio</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </button>
              </div>

              {/* Breadcrumb Section Header */}
              <div className="text-[11px] font-medium text-zinc-400">
                Tasks / <span className="text-white font-semibold">Lander Studio</span>
              </div>

              {/* Task Items List */}
              <div className="space-y-2">
                
                {/* Task 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-medium text-white">UI Design</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Completed
                  </span>
                </div>

                {/* Task 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-medium text-white">Design Review</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Completed
                  </span>
                </div>

                {/* Task 3 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-white">Framer Development</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Pending
                  </span>
                </div>

                {/* Task 4 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-white">Client Review</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Pending
                  </span>
                </div>

              </div>

            </div>
          </motion.div>


          {/* ==================== CARD 4: Auto-Cleanup of Completed Tasks ==================== */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 lg:p-12 flex flex-col justify-between min-w-0 h-full"
          >
            {/* Header Description */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-white mb-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center text-white">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Auto-Cleanup of Completed Tasks
                </h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Effortlessly remove outdated tasks to keep your workspace clutter-free.
              </p>
            </div>

            {/* UI Mockup Card */}
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 min-w-0 overflow-hidden">
              
              {/* Header Title & Timeframe Selector */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <div className="text-xs font-bold text-white">Removed Tasks</div>
                  <div className="text-[10px] text-zinc-400">Automatically Removed Old Tasks</div>
                </div>
                <button className="flex items-center gap-1.5 bg-zinc-900 border border-white/15 text-zinc-300 px-2.5 py-1 rounded-lg text-[11px] hover:text-white transition-colors">
                  <span>12 Months</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>

              {/* Project Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['Project 1', 'Project 2', 'Project 3', 'Project 4'].map((proj) => (
                  <button
                    key={proj}
                    onClick={() => setActiveProjectFilter(proj)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                      activeProjectFilter === proj
                        ? 'bg-zinc-800 text-white border border-white/20'
                        : 'bg-zinc-950 text-zinc-400 border border-white/5 hover:text-zinc-200'
                    }`}
                  >
                    {proj}
                  </button>
                ))}
              </div>

              {/* Removed Tasks List */}
              <div className="space-y-2.5">
                {[
                  { id: 't1', name: 'Special Dashboard Design' },
                  { id: 't2', name: 'News, Hotfix Development' },
                  { id: 't3', name: 'Apex Dashboard Design' },
                ].map((task) => {
                  const isRestored = restoredTasks.includes(task.id);

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-zinc-500" />
                        <span className={`text-xs font-medium ${isRestored ? 'text-emerald-400 line-through' : 'text-white'}`}>
                          {task.name}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleRestore(task.id)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                          isRestored
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30 hover:text-white'
                        }`}
                      >
                        {isRestored ? 'Restored' : 'Restore Now'}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          </motion.div>

        </div>

        {/* ==================== 4-COLUMN FEATURE STRIP (File Sharing, Team Sync, Time Tracker, Task Tags) ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative pt-12 border-t border-white/10"
        >
          {/* Subtle Ambient Top Glow Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-12 bg-gradient-to-b from-white/10 to-transparent blur-xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {secondaryFeatures.map((item, idx) => {
              const IconComponent = item.icon;

              return (
                <div key={idx} className="space-y-2 group">
                  <div className="flex items-center gap-2.5 text-white font-bold text-base md:text-lg">
                    <div className="w-6 h-6 rounded-md bg-zinc-900 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="tracking-tight">{item.title}</span>
                  </div>
                  <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}


