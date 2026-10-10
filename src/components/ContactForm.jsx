import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setError('');
    setFieldErrors({});

    try {
      await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });
      setSubmitted(true);
    } catch (err) {
      // The API returns per-field messages so the user knows exactly what to fix.
      if (err.data?.errors) {
        setFieldErrors(err.data.errors);
        setError(err.data.message || 'Please fix the highlighted fields.');
      } else {
        setError(err.message || 'Could not send your message. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  // Clear a field's error as soon as the user edits it.
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (error) setError('');
  };

  const fieldClass = (field) =>
    `w-full bg-black/60 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[#5f636c] focus:outline-none transition-all ${
      fieldErrors[field]
        ? 'border-red-500/60 focus:border-red-500'
        : 'border-white/10 focus:border-white/30'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="w-full max-w-xl mx-auto bg-[#08080a] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/8 to-transparent blur-2xl pointer-events-none rounded-full" />

      {submitted ? (
        <div className="text-center py-8 sm:py-10 space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white font-tight">Message sent</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Thanks for reaching out. We’ll get back to{' '}
            <span className="text-white font-medium">{formData.email}</span> shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', message: '' });
            }}
            className="mt-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <label className="block text-left">
            <span className="block text-sm font-medium text-white mb-2">Name</span>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={fieldClass('name')}
            />
            {fieldErrors.name && (
              <span className="mt-1.5 block text-xs text-red-400">{fieldErrors.name}</span>
            )}
          </label>

          <label className="block text-left">
            <span className="block text-sm font-medium text-white mb-2">Email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={fieldClass('email')}
            />
            {fieldErrors.email && (
              <span className="mt-1.5 block text-xs text-red-400">{fieldErrors.email}</span>
            )}
          </label>

          <label className="block text-left">
            <span className="block text-sm font-medium text-white mb-2">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Enter your message"
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              className={`${fieldClass('message')} resize-none`}
            />
            {fieldErrors.message && (
              <span className="mt-1.5 block text-xs text-red-400">{fieldErrors.message}</span>
            )}
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-left">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-xs text-red-200">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm py-3.5 rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send your message
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
