import React from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Inbox, Layers, CheckCircle2, Circle, Clock, XCircle, Plus, ChevronDown, ChevronRight, Edit3, Signal, User } from 'lucide-react';
import logoImg from '../assets/small logo.svg';

export default function ProductOverview() {
  const inProgressTasks = [
    { id: 'PER-08', title: "Making Suprema's design system", tag: 'Project (Build in Public)', date: 'Apr 10' },
    { id: 'PER-07', title: 'Create a working prototype', tag: 'Project (Build in Public)', date: 'Apr 11' },
  ];

  const todoTasks = [
    { id: 'PER-06', title: 'Add a landing page for the design system on framer', tag: 'Project (Build in Public)', date: 'Apr 11' },
    { id: 'PER-05', title: 'Add a live preview page on framer', tag: 'Framer Projects', date: 'Apr 11' },
  ];

  const backlogTasks = [
    { id: 'PER-04', title: 'Make a code version of the project', tag: 'Project (Build in Public)', date: 'Apr 8' },
    { id: 'PER-03', title: 'Make a framer template', tag: 'Framer Projects', date: 'Apr 8' },
  ];

  const doneTasks = [
    { id: 'PER-02', title: 'Make cool a space themed portfolio', tag: 'Framer Projects', date: 'Apr 8' },
    { id: 'PER-01', title: 'Add all work related projects on the website', tag: 'Framer Template', date: 'Apr 8' },
  ];

  const canceledTasks = [
    { id: 'PER-02', title: 'Make a simple notion portfolio', tag: 'Project (Build in Public)', date: 'Apr 8' },
    { id: 'PER-01', title: 'Learn Wordpress development', tag: 'Project (Build in Public)', date: 'Apr 8' },
  ];

  return (
    <section id="product-overview" className="relative py-20 md:py-28 bg-black text-white overflow-hidden">
      
      {/* Top Ambient Horizontal Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          
          {/* Central Suprema Emblem Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mx-auto mb-6 relative"
          >
            <img src={logoImg} alt="Suprema Logo" className="h-16 w-auto object-contain" />
          </motion.div>

          {/* Product Overview Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 mb-4"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Product Overview</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-5 font-tight"
          >
            Suprema at a Glance
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal"
          >
            Explore Suprema's powerful features designed to streamline project management, enhance collaboration, and boost efficiency.
          </motion.p>
        </div>

        {/* Large Interactive App UI Dashboard Frame with Top-to-Bottom Fade Mask */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Subtle Outer Glow Border */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-md opacity-60" />

          {/* Main App Frame Container */}
          <div className="relative bg-[#09090b] border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl font-sans [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
              
              {/* Sidebar (Left) */}
              <div className="hidden md:block md:col-span-3 bg-[#0c0c0e] border-r border-zinc-800/80 p-4 space-y-5 text-xs text-zinc-400">
                
                {/* Workspace Header */}
                <div className="flex items-center justify-between text-white font-semibold pb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center relative overflow-hidden">
                      <img src={logoImg} alt="Suprema Logo" className="h-5 w-auto object-contain" />
                    </div>
                    <span className="font-bold text-sm">Suprema</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" />
                    <Edit3 className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" />
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 rounded-lg text-zinc-300 hover:bg-zinc-900 cursor-pointer">
                    <span className="flex items-center gap-2.5"><Inbox className="w-4 h-4 text-zinc-400" /> Inbox</span>
                    <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-mono">22</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer">
                    <span className="flex items-center gap-2.5"><Layers className="w-4 h-4 text-zinc-400" /> My issues</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer">
                    <span className="flex items-center gap-2.5"><Inbox className="w-4 h-4 text-zinc-400" /> Inbox</span>
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium cursor-pointer">
                    <span>Workspace</span>
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium cursor-pointer">
                    <span>Favorites</span>
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                  </div>
                </div>

                {/* Teams */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                    <span>Your teams</span>
                    <ChevronDown className="w-3 h-3 text-zinc-600" />
                  </div>
                  <div className="space-y-1 pl-1">
                    <div className="p-1.5 rounded text-zinc-200 flex items-center justify-between hover:bg-zinc-900 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-blue-600 flex items-center justify-center text-[8px] text-white">▶</span> Personal
                      </span>
                      <ChevronRight className="w-3 h-3 text-zinc-600" />
                    </div>
                    <div className="p-1.5 rounded text-zinc-400 flex items-center justify-between hover:bg-zinc-900 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-purple-600 flex items-center justify-center text-[8px] text-white">📄</span> Templates
                      </span>
                      <ChevronRight className="w-3 h-3 text-zinc-600" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium cursor-pointer pt-1">
                  <span>Try</span>
                  <ChevronRight className="w-3 h-3 text-zinc-600" />
                </div>

              </div>

              {/* Main Task List Area (Right) - Scrollable on Mobile */}
              <div className="col-span-12 md:col-span-9 bg-[#09090b] p-4 sm:p-6 space-y-5 text-xs overflow-x-auto">

                
                {/* Header Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span className="w-3 h-3 rounded bg-blue-600 flex items-center justify-center text-[8px]">▶</span> Personal
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg text-[11px] hover:border-zinc-700">
                      <span>≡ Filter</span>
                    </button>
                    <button className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg text-[11px] hover:border-zinc-700">
                      <span>⊞ Display</span>
                    </button>
                  </div>
                </div>

                {/* Group 1: In Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-amber-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                      </span> 
                      In Progress <span className="text-zinc-400">2</span>
                    </span>
                    <Plus className="w-3.5 h-3.5 text-zinc-600 hover:text-white cursor-pointer" />
                  </div>

                  {inProgressTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <Signal className="w-3 h-3 text-zinc-600" />
                        <span className="text-zinc-400 font-mono text-[11px]">{t.id}</span>
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-zinc-200 font-medium">{t.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-zinc-900/80 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <span className="text-zinc-400">::</span> {t.tag}
                        </span>
                        <span className="text-zinc-400 text-[11px]">{t.date}</span>
                        <User className="w-3 h-3 text-zinc-600" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Group 2: Todo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-zinc-300 font-semibold text-[11px]">
                    <span className="flex items-center gap-2">
                      <Circle className="w-3 h-3 text-zinc-400" /> Todo <span className="text-zinc-400">2</span>
                    </span>
                    <Plus className="w-3.5 h-3.5 text-zinc-600 hover:text-white cursor-pointer" />
                  </div>

                  {todoTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <Signal className="w-3 h-3 text-zinc-600" />
                        <span className="text-zinc-400 font-mono text-[11px]">{t.id}</span>
                        <Circle className="w-2.5 h-2.5 text-zinc-400" />
                        <span className="text-zinc-300">{t.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-zinc-900/80 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <span className="text-zinc-400">::</span> {t.tag}
                        </span>
                        <span className="text-zinc-400 text-[11px]">{t.date}</span>
                        <User className="w-3 h-3 text-zinc-600" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Group 3: Backlog */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-2">
                      <Circle className="w-3 h-3 text-zinc-600 stroke-dasharray" /> Backlog <span className="text-zinc-400">2</span>
                    </span>
                    <Plus className="w-3.5 h-3.5 text-zinc-600 hover:text-white cursor-pointer" />
                  </div>

                  {backlogTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/20 border border-zinc-800/40 text-zinc-400">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[10px]">•••</span>
                        <span className="text-zinc-400 font-mono text-[11px]">{t.id}</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        <span>{t.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-zinc-900/60 border border-zinc-800/60 text-zinc-400 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <span className="text-zinc-400">::</span> {t.tag}
                        </span>
                        <span className="text-zinc-400 text-[11px]">{t.date}</span>
                        <User className="w-3 h-3 text-zinc-700" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Group 4: Done */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-blue-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" /> Done <span className="text-zinc-400">2</span>
                    </span>
                    <Plus className="w-3.5 h-3.5 text-zinc-600 hover:text-white cursor-pointer" />
                  </div>

                  {doneTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 opacity-80">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[10px]">•••</span>
                        <span className="text-zinc-400 font-mono text-[11px]">{t.id}</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        <span className="text-zinc-400">{t.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-zinc-900/80 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <span className="text-zinc-400">::</span> {t.tag}
                        </span>
                        <span className="text-zinc-400 text-[11px]">{t.date}</span>
                        <User className="w-3 h-3 text-zinc-700" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Group 5: Canceled (Faded out at bottom) */}
                <div className="space-y-2 opacity-50">
                  <div className="flex items-center justify-between text-zinc-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-2">
                      <XCircle className="w-3 h-3 text-zinc-600" /> Canceled <span className="text-zinc-400">2</span>
                    </span>
                  </div>

                  {canceledTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/10 border border-zinc-800/30 text-zinc-400">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[10px]">•••</span>
                        <span className="text-zinc-400 font-mono text-[11px]">{t.id}</span>
                        <XCircle className="w-3 h-3 text-zinc-600" />
                        <span className="line-through">{t.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-zinc-950 border border-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <span className="text-zinc-400">::</span> {t.tag}
                        </span>
                        <span className="text-zinc-400 text-[11px]">{t.date}</span>
                        <User className="w-3 h-3 text-zinc-800" />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
