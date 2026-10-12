import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

/**
 * The destination of the emailed reset link: /reset-password?token=...
 *
 * The token is verified before the form is enabled, so somebody following a
 * stale link is told immediately rather than after typing a new password.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token') || '';

  const [checking, setChecking] = useState(true);
  const [tokenError, setTokenError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!token) {
        setTokenError('This reset link is incomplete. Please request a new one.');
        setChecking(false);
        return;
      }
      try {
        const res = await api.get(`/auth/reset-password/verify?token=${encodeURIComponent(token)}`);
        if (!res.valid) setTokenError(res.message || 'This reset link is not valid.');
      } catch (err) {
        setTokenError(err.data?.message || 'This reset link is not valid.');
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password.length > 72) {
      setError('Password must be 72 characters or fewer.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.data?.message || err.message || 'Could not reset your password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {done ? 'Password updated' : 'Choose a new password'}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {done ? 'Taking you back to sign in…' : 'Pick something you have not used before.'}
          </p>
        </div>

        {done ? (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p className="text-sm text-emerald-100">
              Your new password is active. Sign in with it now.
            </p>
          </div>
        ) : checking ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your link…
          </div>
        ) : tokenError ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-sm text-amber-100">{tokenError}</p>
            </div>
            <Link
              to="/login"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white font-bold text-black transition hover:bg-zinc-200"
            >
              Request a new link
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                New password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-800/60 px-4 focus-within:border-white/30">
                <Lock className="h-4 w-4 shrink-0 text-zinc-500" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="shrink-0 text-zinc-500 transition hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Confirm password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-800/60 px-4 focus-within:border-white/30">
                <ShieldCheck className="h-4 w-4 shrink-0 text-zinc-500" />
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                  autoComplete="new-password"
                  className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {!done && (
          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
            <ShieldCheck className="h-3 w-3" />
            256-bit encryption · bcrypt hashed
          </p>
        )}
      </motion.div>
    </div>
  );
}