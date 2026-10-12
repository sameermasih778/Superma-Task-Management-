import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

/**
 * "Forgot password" dialog.
 *
 * The confirmation copy is deliberately identical whether or not the address is
 * registered - matching the API, which never reveals that. Telling someone "no
 * account has that email" would turn this box into a way to discover who has an
 * account here.
 */
export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState('');

  const handleClose = () => {
    setEmail('');
    setError('');
    setSent(false);
    setDevLink('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setSent(true);
      // Only ever present when the server has no SMTP configured. Handy locally,
      // and impossible in production where mail is configured.
      if (res.devResetUrl) setDevLink(res.devResetUrl);
    } catch (err) {
      setError(err.data?.message || err.message || 'Could not send the reset link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Reset your password"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Reset your password</h2>
                  <p className="text-xs text-zinc-500">We will email you a link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sent ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="text-sm leading-relaxed text-emerald-100">
                    If an account exists for that address, a reset link is on its way.
                    The link expires in 30 minutes and can only be used once.
                  </p>
                </div>

                {devLink && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-400">
                      Development only
                    </p>
                    <p className="mb-2 break-all text-[11px] text-amber-200/80">
                      No mail server is configured, so here is the link:
                    </p>
                    <a href={devLink} className="text-xs text-amber-200 underline underline-offset-2">
                      {devLink}
                    </a>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="h-11 w-full rounded-xl bg-white font-bold text-black transition hover:bg-zinc-200"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Email address
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-800/60 px-4 focus-within:border-white/30">
                    <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
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
                  disabled={sending}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}