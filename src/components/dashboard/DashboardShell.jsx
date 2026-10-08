import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Activity as ActivityIcon, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { accentVars } from './accents';

/**
 * Shared design system for every role-aware dashboard.
 *
 * Three portals render very different content, but they must still feel like
 * one product. Rather than letting each dashboard invent its own cards, banners
 * and spacing (which is how the two previous implementations drifted apart),
 * everything structural lives here and each role only supplies its content.
 *
 * Colour is applied through CSS custom properties (see accents.js) so a role
 * can change the whole palette by swapping one entry - no duplicated Tailwind
 * class strings per role.
 */

/* ────────────────────────────── Shell ────────────────────────────── */

export function DashboardShell({ tier, children, className = '' }) {
  return (
    <div style={accentVars(tier)} className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
}

/* ───────────────────────────── Banner ───────────────────────────── */

export function DashboardBanner({
  eyebrow,
  title,
  subtitle,
  chips = [],
  actions = []
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[color:var(--accent-ring)] p-6"
      style={{ background: 'var(--accent-gradient)' }}
    >
      <div
        className="pointer-events-none absolute -top-24 right-0 h-56 w-72 blur-3xl"
        style={{ background: 'var(--accent-glow)' }}
      />
      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                color: 'var(--accent)',
                background: 'var(--accent-soft)',
                borderColor: 'var(--accent-ring)',
              }}
            >
              {eyebrow}
            </span>
            {chips.map((chip) => (
              <span
                key={chip.label}
                title={chip.title}
                className="rounded-md border border-white/10 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
              >
                {chip.label}
              </span>
            ))}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-xs text-zinc-400 sm:text-sm">{subtitle}</p>}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <Link
                key={action.to + action.label}
                to={action.to}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-black transition-all hover:brightness-110"
                style={{ background: 'var(--accent)' }}
              >
                {action.icon}
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────── Stat card ──────────────────────────── */

const TONE_CLASSES = {
  neutral: 'text-zinc-400',
  positive: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-red-400',
  accent: 'text-[color:var(--accent)]',
};

export function StatCard({ label, value, hint, icon, tone = 'neutral', loading = false }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-5"
    >
      {/* Hairline of accent along the top edge */}
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent-ring), transparent)' }}
      />
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </span>
        {icon && <span className={TONE_CLASSES[tone] || TONE_CLASSES.neutral}>{icon}</span>}
      </div>
      <p className="text-2xl font-bold tabular-nums text-white">
        {loading ? <span className="text-zinc-600">--</span> : value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-zinc-500">{hint}</p>}
    </motion.div>
  );
}

/* ─────────────────────────── Section card ────────────────────────── */

export function SectionCard({ title, icon, action, children, className = '', bodyClassName = '' }) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-zinc-950 ${className}`}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-white">
            {icon && <span className="text-[color:var(--accent)]">{icon}</span>}
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function SectionLink({ to, label }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 transition-colors hover:text-white"
    >
      {label}
      <ChevronRight className="h-3 w-3" />
    </Link>
  );
}

/* ───────────────────────────── Progress ──────────────────────────── */

export function ProgressBar({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-zinc-900 ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: 'var(--accent)' }}
      />
    </div>
  );
}

/* ────────────────────────────── Pills ────────────────────────────── */

const PRIORITY_STYLES = {
  urgent: 'border-red-500/30 bg-red-500/15 text-red-400',
  high: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
  medium: 'border-zinc-700 bg-zinc-800/70 text-zinc-300',
  low: 'border-zinc-800 bg-zinc-900 text-zinc-500',
};

const STATUS_STYLES = {
  done: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
  in_progress: 'border-sky-500/30 bg-sky-500/15 text-sky-400',
  review: 'border-violet-500/30 bg-violet-500/15 text-violet-400',
  todo: 'border-zinc-700 bg-zinc-800/70 text-zinc-300',
  backlog: 'border-zinc-800 bg-zinc-900 text-zinc-500',
};

export function PriorityPill({ priority }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
        PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium
      }`}
    >
      {priority}
    </span>
  );
}

export function StatusPill({ status }) {
  const key = String(status || '').toLowerCase();
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
        STATUS_STYLES[key] || STATUS_STYLES.todo
      }`}
    >
      {key.replace(/_/g, ' ')}
    </span>
  );
}

/* ───────────────────────────── Feed ──────────────────────────────── */

export function ActivityFeed({ activities = [], limit = 8, emptyHint = 'No activity recorded yet.' }) {
  if (!activities.length) {
    return <EmptyState icon={<Inbox className="h-6 w-6" />} title={emptyHint} />;
  }

  return (
    <ol className="relative space-y-4 pl-5">
      <span className="absolute inset-y-1 left-[5px] w-px bg-white/[0.07]" />
      {activities.slice(0, limit).map((act) => (
        <li key={act.id} className="relative">
          <span
            className="absolute -left-5 top-1.5 h-2 w-2 rounded-full ring-4 ring-zinc-950"
            style={{ background: 'var(--accent)' }}
          />
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-xs font-semibold text-white">
              {act.user_name || 'System'}
            </p>
            <time className="shrink-0 font-mono text-[10px] text-zinc-500">
              {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </time>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-500">
            {String(act.action || '').replace(/_/g, ' ').toLowerCase()}
            {act.entity_type ? ` · ${act.entity_type}` : ''}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ─────────────────────────── Empty state ─────────────────────────── */

export function EmptyState({ icon, title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
      <span className="text-zinc-700">{icon}</span>
      <p className="text-xs font-medium text-zinc-400">{title}</p>
      {hint && <p className="max-w-xs text-[11px] text-zinc-600">{hint}</p>}
      {action}
    </div>
  );
}

export function LoadingBlock({ label = 'Loading workspace data...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-xs text-zinc-600">
      <ActivityIcon className="h-3.5 w-3.5 animate-spin" />
      {label}
    </div>
  );
}