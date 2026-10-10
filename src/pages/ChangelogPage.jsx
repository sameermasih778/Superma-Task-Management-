import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Sparkles,
  Bell
} from 'lucide-react';
import api from '../utils/api';
import { changelogEntries as fallbackEntries } from '../data/changelogData';
import smallLogo from '../assets/small logo.svg';
import FreeTrialSection from '../components/FreeTrialSection';

export default function ChangelogPage() {
  const containerRef = useRef(null);

  /**
   * Release notes come from the API (GET /changelogs). The bundled static file
   * stays as a fallback: this is a public marketing page, so a backend hiccup
   * must never leave a visitor staring at an empty timeline.
   */
  const [entries, setEntries] = useState(fallbackEntries);

  useEffect(() => {
    let cancelled = false;

    api.get('/changelogs')
      .then((res) => {
        if (!cancelled && Array.isArray(res.changelogs) && res.changelogs.length > 0) {
          setEntries(res.changelogs);
        }
      })
      .catch((err) => {
        console.warn('[Changelog] Falling back to bundled release notes:', err.message);
      });

    return () => { cancelled = true; };
  }, []);

  // Track vertical scroll progress across the timeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 30%', 'end 80%'],
  });

  // Smooth scroll spring animation for professional fluid movement
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="bg-black text-white min-h-screen pt-24 sm:pt-32 md:pt-36 pb-16 overflow-hidden relative font-sans">
      
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Studio Spotlights & Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-purple-600/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-600/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* ==================== 1. HERO HEADER ==================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-24 text-center">
        
        {/* Top Suprema Shield Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', y: -15 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 flex items-center justify-center mb-5 sm:mb-6"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-48 h-36 sm:h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div 
            className="absolute -inset-6 sm:-inset-10 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: '14px 14px',
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
            }}
          />

          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img src={smallLogo} alt="Suprema Shield" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" />
          </motion.div>
        </motion.div>

        {/* Top Badge Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          whileHover={{ scale: 1.04 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm font-semibold text-emerald-400 mb-4 sm:mb-5 shadow-sm backdrop-blur-md cursor-default"
        >
          <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 text-emerald-400" />
          <span>Changelog</span>
        </motion.div>

        {/* Main Title */}
        <div className="relative max-w-4xl mx-auto mb-4 sm:mb-6 px-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] sm:max-w-[480px] h-[70px] sm:h-[100px] bg-white/[0.08] rounded-full blur-3xl pointer-events-none" />
          
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-tight leading-[1.12] sm:leading-[1.1] relative z-10"
          >
            What’s New in Suprema
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed font-normal px-4"
        >
          Stay updated with the latest features, improvements, and bug fixes added to Suprema regularly.
        </motion.p>

        {/* Action Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-20"
        >
          <motion.a
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            href="#free-trial"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-bold text-xs sm:text-sm shadow-xl hover:bg-zinc-200 transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5 text-black fill-black" />
            <span>Subscribe to updates</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 border border-white/15 text-zinc-300 hover:text-white hover:border-white/30 font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            <span className="font-bold text-lg text-white">𝕏</span>
            <span>Follow us on Twitter</span>
          </motion.a>
        </motion.div>

      </section>


      {/* ==================== 2. TIMELINE SECTION WITH SCROLL-DRIVEN PROGRESS LINE ==================== */}
      <section ref={containerRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 sm:mb-32">
        <div className="relative border-l border-white/20 md:border-l-0">
          
          {/* 1. Background Track Line (Desktop) */}
          <div className="hidden md:block absolute left-[25%] top-2 bottom-2 w-[2px] bg-white/20 rounded-full" />

          {/* 2. Active Animated Scroll Progress Line (Pure White Glowing Line) */}
          <motion.div
            style={{ scaleY, transformOrigin: 'top' }}
            className="hidden md:block absolute left-[25%] top-2 bottom-2 w-[2px] bg-white rounded-full z-10 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
          />

          <div className="space-y-16 sm:space-y-24">
            {entries.map((entry, idx) => (
              <div key={entry.id} className="relative md:grid md:grid-cols-12 md:gap-8 items-start group">
                
                {/* Glowing White Node Dot (Desktop) */}
                <div className="hidden md:flex absolute left-[25%] top-2 -translate-x-1/2 items-center justify-center z-20">
                  <motion.div
                    whileInView={{ scale: [0.8, 1.25, 1] }}
                    viewport={{ once: false, margin: '-20%' }}
                    className="w-3.5 h-3.5 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                  </motion.div>
                </div>

                {/* Left Date Column */}
                <motion.div
                  initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="pl-6 md:pl-0 md:col-span-3 md:text-right md:pr-8 mb-4 md:mb-0"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 tracking-wide cursor-default">
                    <span>{entry.date}</span>
                    <span className="text-[15px] text-zinc-500">▶</span>
                  </div>
                </motion.div>

                {/* Right Content Column */}
                <motion.div
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 + 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="pl-6 md:pl-6 md:col-span-9 text-left"
                >
                  {/* Badge Text */}
                  <span className={`text-xs sm:text-sm font-semibold mb-4 inline-block ${entry.badgeColor}`}>
                    {entry.badge}
                  </span>

                  {/* Main Entry Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4 font-tight">
                    {entry.title}
                  </h2>

                  {/* Main Summary Description */}
                  <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed mb-8 max-w-2xl">
                    {entry.description}
                  </p>

                  {/* Sub-item Section */}
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-tight">
                      {entry.subItemTitle}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed mb-4 max-w-2xl">
                      {entry.subItemDescription}
                    </p>
                    <div className="text-sm sm:text-base text-zinc-500 font-normal mb-6">
                      {entry.tag}
                    </div>
                  </div>

                  {/* Featured Graphic Banner Card (Matching Screenshot exactly) */}
                  <div className="w-full h-64 sm:h-72 lg:h-80 bg-gradient-to-b from-[#181920] via-[#0d0d12] to-[#070709] rounded-2xl sm:rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center p-6 sm:p-8 mb-8 shadow-2xl group-hover:border-white/25 transition-all shadow-inner">
                    {/* Top Spotlight Beam */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-36 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-2xl pointer-events-none" />
                    
                    {/* Subtle Dot Grid Pattern */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Suprema Shield Logo Badge Emblem in center */}
                    <div className="flex items-center justify-center text-white mb-4 relative z-10 group-hover:scale-110 transition-transform">
                      <img src={smallLogo} alt="Suprema Logo" className="h-12 sm:h-14 lg:h-16 w-auto object-contain" />
                    </div>

                    {/* Banner Card Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white tracking-tight leading-tight relative z-10 font-tight whitespace-pre-line px-2">
                      {entry.bannerTitle}
                    </h3>
                  </div>

                  {/* Bullets List */}
                  <div className="space-y-2.5 mb-6">
                    {entry.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2 flex-shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note box */}
                 

                </motion.div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================== 3. FREE TRIAL CTA SECTION ==================== */}
      <FreeTrialSection />

    </div>
  );
}
