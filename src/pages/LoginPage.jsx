import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldAlert, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Secret internal portal check
  const isInternalPortal = location.pathname.includes('/admin-login') || location.pathname.includes('/staff-portal');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[LoginPage] Submitting login for:', email);
      const result = await login(email, password);
      console.log('[LoginPage] Login result:', result);
      navigate('/dashboard');
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      const errorMessage = err.data?.message || err.message || 'Login failed. Please check credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden pt-24 pb-16">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.04] blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        className="w-full max-w-md bg-zinc-950/80 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
            {isInternalPortal ? <ShieldCheck className="w-6 h-6 text-indigo-400" /> : <Lock className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {isInternalPortal ? 'Staff & Admin Portal' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-zinc-400">
            {isInternalPortal ? 'Authorized Suprema Team & Developer Access' : 'Sign in to your Suprema SaaS workspace'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-medium">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@suprema.io"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold rounded-xl py-3 px-4 text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 mt-2 shadow-md cursor-pointer"
          >
            {loading ? 'Authenticating...' : (
              <>
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Buttons - Only visible on internal staff / admin portal route */}
        {isInternalPortal && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Internal Authorized Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount('admin@suprema.io')}
                className="px-2.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-xs text-zinc-300 hover:text-white transition-all cursor-pointer font-medium text-center"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('developer@suprema.io')}
                className="px-2.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-xs text-zinc-300 hover:text-white transition-all cursor-pointer font-medium text-center"
              >
                Developer
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-zinc-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:underline font-medium">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
