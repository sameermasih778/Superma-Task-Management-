import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldAlert, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';

// Google Identity Services. Set VITE_GOOGLE_CLIENT_ID to enable the button;
// without it the page simply hides the Google option instead of showing a
// button that cannot work.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      sessionStorage.setItem('suprema_login_type', 'user');
      localStorage.setItem('suprema_last_login_type', 'user');
      await login(email, password, 'user');
      // Simple user lands on the main website home page with Navbar
      navigate('/');
    } catch (err) {
      const errorMessage = err.data?.message || err.message || 'Login failed. Please check credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden pt-28 pb-16 selection:bg-white selection:text-black">
      
      {/* Animated Ambient Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/[0.07] blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.25, 0.1],
          x: [0, -30, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/3 w-[450px] h-[300px] bg-indigo-500/[0.08] blur-[100px] rounded-full pointer-events-none"
      />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-zinc-950/80 border border-white/10 rounded-3xl p-7 sm:p-9 backdrop-blur-2xl relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden group"
      >
        {/* Top subtle ambient border glow */}
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 blur-2xl rounded-full pointer-events-none group-hover:bg-white/20 transition-all duration-700" />

        {/* Card Header */}
        <div className="text-center mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-14 h-14 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-black/50 relative group-hover:border-white/30 transition-all"
          >
            <Lock className="w-6 h-6 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-xs sm:text-sm text-zinc-400"
          >
            Sign in to access your Suprema SaaS workspace
          </motion.p>
        </div>

        {/* Error Alert with Motion */}
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
        {/* Custom-styled Google sign-in. The component renders nothing when no
            client ID is configured, so the divider disappears with it. */}
        {GOOGLE_CLIENT_ID && (
          <div className="space-y-7">
            <GoogleSignInButton
              onCredential={async (accessToken) => {
                setError('');
                try {
                  sessionStorage.setItem('suprema_login_type', 'user');
                  localStorage.setItem('suprema_last_login_type', 'user');
                  await loginWithGoogle(accessToken);
                  navigate('/');
                } catch (err) {
                  setError(err.data?.message || err.message || 'Google sign-in failed. Please try again.');
                }
              }}
            />

            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-white/20" />
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                or continue with email
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/12 to-white/20" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group/input">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-white transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all shadow-inner"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group/input">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-white transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all shadow-inner"
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
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold rounded-xl py-3.5 px-4 text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-lg shadow-white/5 cursor-pointer relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Footer Link & SSL Security Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t border-white/10 text-center space-y-4"
        >
          <p className="text-xs text-zinc-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-white hover:underline font-semibold transition-all">
              Create account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encryption â€¢ JWT Workspace Session</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
