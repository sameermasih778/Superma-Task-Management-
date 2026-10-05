import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ShieldAlert, KeyRound, CheckCircle2, RotateCcw, Edit2 } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Input details, 2: Verification Code
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Timer countdown for resending code
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Send OTP to user's email address
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await sendOtp(email);
      setInfoMsg(`A 6-digit verification code was sent to ${email}`);
      setStep(2);
      setResendTimer(60); // 60s cooldown
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to send verification code. Please check email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError('');
    setInfoMsg('');
    setLoading(true);

    try {
      await sendOtp(email);
      setInfoMsg(`A new 6-digit verification code was sent to ${email}`);
      setResendTimer(60);
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and create account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem('suprema_last_login_type', 'user');
      await verifyOtp(name, email, password, otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err.data?.message || err.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden pt-28 pb-16 selection:bg-white selection:text-black">
      
      {/* Background Ambient Glows */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/[0.1] blur-[130px] rounded-full pointer-events-none"
      />

      <div className="w-full max-w-md bg-zinc-950/90 border border-white/10 rounded-3xl p-7 sm:p-9 backdrop-blur-2xl relative z-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-10 bg-indigo-500' : 'w-4 bg-zinc-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-10 bg-indigo-500' : 'w-4 bg-zinc-800'}`} />
        </div>

        {/* Card Header */}
        <div className="text-center mb-6">
          <motion.div
            key={step}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-xl"
          >
            {step === 1 ? <User className="w-6 h-6 text-indigo-400" /> : <KeyRound className="w-6 h-6 text-indigo-400 animate-bounce" />}
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {step === 1 ? 'Create Account' : 'Verify Email Address'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {step === 1 ? 'Join Suprema Task Management Platform' : `Enter 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Info / Success Message Alert */}
        <AnimatePresence>
          {infoMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2.5 text-emerald-400 text-xs font-medium"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{infoMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-2.5 text-red-400 text-xs font-medium"
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 1: Registration Credentials Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative group/input">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold rounded-xl py-3.5 px-4 text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 mt-2 shadow-lg cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Sending Code...</span>
                </div>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Verification Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">6-Digit Verification Code</label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Email</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full bg-black border-2 border-indigo-500/50 rounded-2xl py-3 px-4 text-center text-2xl font-mono font-bold tracking-[0.6em] text-indigo-300 focus:outline-none focus:border-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 text-center">
                Code expires in 10 minutes. Check your spam folder if not received.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold rounded-xl py-3.5 px-4 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Code...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verify Code & Complete Registration</span>
                </>
              )}
            </button>

            {/* Resend Code Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className="text-xs text-zinc-400 hover:text-white disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {resendTimer > 0 ? (
                  <span>Resend Code in {resendTimer}s</span>
                ) : (
                  <span className="text-indigo-400 hover:underline">Resend Code Now</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-zinc-500 mt-6 pt-4 border-t border-white/10">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline font-semibold">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
