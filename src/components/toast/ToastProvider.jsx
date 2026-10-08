import React, { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';
import { ToastContext } from './ToastContext';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    ring: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    bar: 'bg-emerald-500',
    label: 'Success'
  },
  error: {
    icon: XCircle,
    ring: 'border-red-500/30',
    iconColor: 'text-red-400',
    bar: 'bg-red-500',
    label: 'Error'
  },
  warning: {
    icon: AlertTriangle,
    ring: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    bar: 'bg-amber-500',
    label: 'Warning'
  },
  info: {
    icon: Info,
    ring: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    bar: 'bg-sky-500',
    label: 'Information'
  }
};

const DEFAULT_DURATION = {
  success: 4000,
  info: 4000,
  warning: 6000,
  // Failures stay longer: they usually carry a message worth reading.
  error: 7000
};

const MAX_VISIBLE = 4;

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (variant, message, options = {}) => {
      const id = ++nextId;
      const duration = options.duration ?? DEFAULT_DURATION[variant] ?? 4000;

      setToasts((prev) => {
        const next = [...prev, { id, variant, message, duration }];
        // Drop the oldest once the stack gets noisy, so a burst of failures
        // cannot bury the screen.
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
      });

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration)
        );
      }

      return id;
    },
    [dismiss]
  );

  // Clear every pending timer if the provider unmounts, otherwise a toast
  // dismissed after unmount would try to update a dead component.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, []);

  const toast = {
    success: (msg, opts) => push('success', msg, opts),
    error: (msg, opts) => push('error', msg, opts),
    warning: (msg, opts) => push('warning', msg, opts),
    info: (msg, opts) => push('info', msg, opts),
    dismiss
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      // aria-live so screen readers announce results of actions
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2.5"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const variant = VARIANTS[t.variant] || VARIANTS.info;
          const Icon = variant.icon;

          return (
            <motion.div
              key={t.id}
              layout
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={`pointer-events-auto relative overflow-hidden rounded-xl border bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl ${variant.ring}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${variant.iconColor}`} aria-hidden="true" />
                <p className="min-w-0 flex-1 text-xs font-medium leading-relaxed text-zinc-100">
                  {t.message}
                </p>
                <button
                  onClick={() => onDismiss(t.id)}
                  aria-label={`Dismiss ${variant.label.toLowerCase()} message`}
                  className="shrink-0 cursor-pointer rounded-md p-0.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Countdown bar - visual only, the timer above is the source of truth */}
              {t.duration > 0 && (
                <motion.span
                  className={`absolute inset-x-0 bottom-0 h-0.5 ${variant.bar}`}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: t.duration / 1000, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}