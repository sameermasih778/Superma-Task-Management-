import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldAlert, Sparkles, ShieldCheck, Terminal, Eye, EyeOff, UserCheck, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // 'super_admin' | 'developer' | null
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[AdminLoginPage] Submitting login for:', email);
      localStorage.setItem('suprema_last_login_type', 'admin');
      const result = await login(email, password);
      console.log('[AdminLoginPage] Login result:', result);
      navigate('/dashboard');
    } catch (err) {
      console.error('[AdminLoginPage] Login error:', err);
      const errorMessage = err.data?.message || err.message || 'Login failed. Please check credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectRolePreset = (roleType, demoEmail) => {
    setSelectedRole(roleType);
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden pt-28 pb-16 selection:bg-indigo-500 selection:text-white">
      
      {/* Animated Glowing Cyber Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600/[0.12] blur-[140px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 left-1/3 w-[500px] h-[320px] bg-emerald-500/[0.08] blur-[120px] rounded-full pointer-events-none"
      />

      {/* Cyber Grid Lines Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#6366f108_1px,transparent_1px),linear-gradient(to_bottom,#6366f108_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-zinc-950/90 border border-indigo-500/25 rounded-3xl p-7 sm:p-9 backdrop-blur-2xl relative z-10 shadow-[0_0_60px_rgba(99,102,241,0.15)] overflow-hidden group"
      >
        {/* Top Glowing Accent Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_#6366f1]" />

        {/* Card Header */}
        <div className="text-center mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-b from-indigo-950 to-zinc-950 border border-indigo-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-2xl shadow-indigo-950/80 relative"
          >
            <ShieldCheck className="w-8 h-8 text-indigo-400 animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5"
          >
            Admin & Developer Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-xs sm:text-sm text-zinc-400"
          >
            Authorized Internal Staff & Administrative Access
          </motion.p>
        </div>

        {/* Interactive Quick Fill Role Selection Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-1.5 bg-zinc-900/80 border border-white/10 rounded-2xl grid grid-cols-2 gap-1.5"
        >
          <button
            type="button"
            onClick={() => selectRolePreset('super_admin', 'admin@suprema.io')}
            className={`relative py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedRole === 'super_admin' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {selectedRole === 'super_admin' && (
              <motion.div
                layoutId="activeRoleBg"
                className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            <ShieldCheck className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Super Admin</span>
          </button>

          <button
            type="button"
            onClick={() => selectRolePreset('developer', 'developer@suprema.io')}
            className={`relative py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedRole === 'developer' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {selectedRole === 'developer' && (
              <motion.div
                layoutId="activeRoleBg"
                className="absolute inset-0 bg-emerald-600 rounded-xl shadow-md"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            <Terminal className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Developer</span>
          </button>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start gap-3 text-red-400 text-xs font-medium backdrop-blur-md"
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group/input">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSelectedRole(null);
                }}
                placeholder="admin@suprema.io"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Access Password
            </label>
            <div className="relative group/input">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold rounded-xl py-3.5 px-4 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Access Internal Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Footer & Public Switch Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t border-white/10 text-center space-y-4"
        >
          <p className="text-xs text-zinc-400">
            Need public account access?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition-all">
              Go to Public Login
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>Role-Based Access Control (RBAC) Enabled</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
