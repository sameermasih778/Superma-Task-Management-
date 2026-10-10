import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Folder,
  Users,
  Timer,
  Tag,
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';
import logoImg from '../assets/small logo.svg';
import smallLogo from '../assets/small logo.svg';
import waitlistVideo from '../assets/Waitlist-Video.mp4';
import FAQSection from '../components/FAQSection';
import FreeTrialSection from '../components/FreeTrialSection';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState(null);
  const [referralCode, setReferralCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || joining) return;

    setJoining(true);
    setError('');

    try {
      const res = await api.post('/waitlist', { email: email.trim(), source: 'waitlist_page' });
      setPosition(res.position);
      setReferralCode(res.referralCode || null);
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Could not join the waitlist. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const waitlistFeatures = [
    {
      icon: Folder,
      title: 'File Sharing',
      description: 'Easily upload and share project files securely.',
    },
    {
      icon: Users,
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-emerald-600/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* ==================== 1. HERO WAITLIST HEADER ==================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 text-center">

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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm font-semibold text-emerald-400 mb-4 sm:mb-5 shadow-sm backdrop-blur-md cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-6 text-emerald-500" />
          <span>Waitlist</span>
        </motion.div>

        {/* Main Title */}
        <div className="relative max-w-4xl mx-auto mb-4 sm:mb-6 px-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] sm:max-w-[480px] h-[70px] sm:h-[100px] bg-white/[0.08] rounded-full blur-3xl pointer-events-none" />

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-tight leading-[1.08] relative z-10"
          >
            Get early access
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed font-normal px-4"
        >
          Be amongst the first to experience Wait and launch a viral waitlist. Sign up to be notified when we launch!
        </motion.p>

        {/* Waitlist Subscription Form Box */}
        <motion.form
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          onSubmit={handleSubmit}
          className="relative z-10 max-w-lg mx-auto mb-4 px-2"
        >
          <div className="bg-zinc-950 border border-white/15 rounded-2xl sm:rounded-full p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 shadow-2xl backdrop-blur-xl">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-transparent px-4 sm:px-6 py-3 sm:py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none flex-grow w-full rounded-xl sm:rounded-full"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={joining}
              className="bg-white text-black font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-full hover:bg-zinc-200 transition-all shadow-md cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {joining ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Joining...
                </>
              ) : submitted ? (
                'Joined Waitlist!'
              ) : (
                'Join Waitlist'
              )}
            </motion.button>
          </div>

          {/* Real queue position returned by the API */}
          {submitted && position && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-xs text-emerald-400 font-semibold"
            >
              You are #{position} in line
              {referralCode && (
                <span className="text-zinc-500 font-normal"> · referral code {referralCode}</span>
              )}
            </motion.p>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </motion.p>
          )}
        </motion.form>

        {/* No Spam Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-medium mb-12 sm:mb-16"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>No Spam, Only Genuine Updates</span>
        </motion.div>

        {/* ==================== VIDEO SHOWCASE CARD (Matching Screenshot) ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative bg-[#050505] p-2 sm:p-3 mb-12 sm:mb-16 group hover:border-white/30 transition-all"
        >
          {/* Subtle Arc Light Beam on top of video container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-white/15 via-white/5 to-transparent blur-2xl pointer-events-none" />

          {/* Video Player */}
          <video
            src={waitlistVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-2xl sm:rounded-2xl object-cover shadow-2xl border border-white/10"
          />
        </motion.div>

        {/* ==================== FEATURE ITEMS BAR BELOW VIDEO (Matching Screenshot) ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left px-4 sm:px-6"
        >
          {waitlistFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white font-tight">
                  <Icon className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                  <span>{feat.title}</span>
                </div>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </motion.div>

      </section>

      {/* Horizontal Light Beam Section Divider */}
      <div className="relative max-w-5xl mx-auto mb-16 sm:mb-20">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* ==================== 2. FAQ SECTION ==================== */}
      <FAQSection />

      {/* ==================== 3. FREE TRIAL CTA SECTION ==================== */}
      <FreeTrialSection />

    </div>
  );
}
