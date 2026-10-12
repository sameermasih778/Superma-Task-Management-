import React, { useState, useEffect, useCallback } from 'react';
import {
  Inbox, ListOrdered, Download, Mail, Loader2, AlertCircle,
  CheckCircle2, RefreshCw, Clock, Users, Ticket
} from 'lucide-react';
import api, { API_BASE_URL } from '../utils/api';
import { useToast } from '../components/toast/ToastContext';

/**
 * Lead Inbox — staff view of the two marketing funnels.
 *
 * The contact form and the waitlist have been writing rows since the marketing
 * APIs shipped. Before this page, staff could not read their own leads; the
 * rows existed and nothing surfaced them.
 */

const CONTACT_STATUS = {
  unread:  { label: 'Unread',  color: 'bg-blue-500/10 border-blue-500/25 text-blue-400' },
  read:    { label: 'Read',    color: 'bg-zinc-800 border-white/10 text-zinc-400' },
  replied: { label: 'Replied', color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' },
};

const WAITLIST_STATUS = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 border-amber-500/25 text-amber-400' },
  invited: { label: 'Invited', color: 'bg-blue-500/10 border-blue-500/25 text-blue-400' },
  active:  { label: 'Active',  color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' },
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

/**
 * Download a CSV through a plain fetch.
 *
 * The shared api helper parses every response as JSON, which would throw the
 * file away, so this deliberately does not use it - it needs the raw response
 * body as a blob.
 */
const downloadCsv = async (type, filename) => {
  const token = sessionStorage.getItem('suprema_token') || localStorage.getItem('suprema_token');
  const res = await fetch(`${API_BASE_URL}/admin/leads/export?type=${type}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!res.ok) {
    let message = `Export failed (HTTP ${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* keep the HTTP-status message */
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function StatCard({ icon: Icon, label, value, tone = 'text-white' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
        <Icon className="h-4 w-4 text-zinc-400" />
      </span>
      <div>
        <p className="text-lg font-bold leading-none text-white">{value}</p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      </div>
      <span className="sr-only">{tone}</span>
    </div>
  );
}

function StatusPill({ status, map }) {
  const cfg = map[status] || { label: status, color: 'bg-zinc-800 border-white/10 text-zinc-400' };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/12 bg-zinc-900/30 px-6 py-14 text-center">
      <Icon className="mb-3 h-8 w-8 text-zinc-600" />
      <p className="text-sm font-semibold text-zinc-300">{title}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export default function AdminLeadsPage() {
  const toast = useToast();
  const [tab, setTab] = useState('contact');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState('');
  const [contact, setContact] = useState({ messages: [], summary: {} });
  const [waitlist, setWaitlist] = useState({ leads: [], summary: {} });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [c, w] = await Promise.all([
        api.get('/admin/leads/contact'),
        api.get('/admin/leads/waitlist')
      ]);
      setContact(c);
      setWaitlist(w);
    } catch (err) {
      setError(err.data?.message || err.message || 'Could not load leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeContactStatus = async (id, status) => {
    try {
      await api.patch(`/admin/leads/contact/${id}/status`, { status });
      setContact((prev) => ({
        ...prev,
        messages: prev.messages.map((m) => (m.id === id ? { ...m, status } : m))
      }));
    } catch (err) {
      toast.error(err.data?.message || 'Could not update that inquiry.');
    }
  };

  const changeWaitlistStatus = async (id, status) => {
    try {
      await api.patch(`/admin/leads/waitlist/${id}/status`, { status });
      setWaitlist((prev) => ({
        ...prev,
        leads: prev.leads.map((l) => (l.id === id ? { ...l, status } : l))
      }));
    } catch (err) {
      toast.error(err.data?.message || 'Could not update that signup.');
    }
  };

  const handleExport = async (type, filename) => {
    setExporting(type);
    try {
      await downloadCsv(type, filename);
      toast.success(`${filename} downloaded.`);
    } catch (err) {
      toast.error(err.message || 'Export failed.');
    } finally {
      setExporting('');
    }
  };

  const TABS = [
    { key: 'contact', label: 'Contact Inbox', icon: Inbox, count: contact.summary?.total ?? 0 },
    { key: 'waitlist', label: 'Waitlist', icon: ListOrdered, count: waitlist.summary?.total ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Lead Inbox</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Every inquiry and waitlist signup captured by the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl border border-white/10 bg-zinc-900/60 p-1">
        {TABS.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
              tab === key ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <span className={`rounded-full px-1.5 text-[10px] ${tab === key ? 'bg-black/10' : 'bg-white/10'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading leads…
        </div>
      ) : tab === 'contact' ? (
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard icon={Mail} label="Total inquiries" value={contact.summary?.total ?? 0} />
            <StatCard icon={Clock} label="Unread" value={contact.summary?.unread ?? 0} />
            <StatCard icon={CheckCircle2} label="Replied" value={contact.summary?.replied ?? 0} />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleExport('contact', 'suprema-contact-leads.csv')}
              disabled={exporting === 'contact'}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {exporting === 'contact'
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />}
              Export CSV
            </button>
          </div>

          {contact.messages.length === 0 ? (
            <EmptyState icon={Inbox} title="No inquiries yet" hint="Messages sent through the contact form will appear here." />
          ) : (
            <ul className="space-y-3">
              {contact.messages.map((m) => (
                <li
                  key={m.id}
                  className={`rounded-xl border bg-zinc-900/60 p-4 transition ${
                    m.status === 'unread' ? 'border-blue-500/25' : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-white">{m.name}</p>
                        <StatusPill status={m.status} map={CONTACT_STATUS} />
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        <a href={`mailto:${m.email}`} className="underline-offset-2 hover:text-white hover:underline">
                          {m.email}
                        </a>
                        <span className="mx-2 text-zinc-700">|</span>
                        {m.subject}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-500">{formatDate(m.created_at)}</span>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{m.message}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {Object.entries(CONTACT_STATUS).map(([value, cfg]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => changeContactStatus(m.id, value)}
                        disabled={m.status === value}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition disabled:cursor-default ${
                          m.status === value
                            ? `${cfg.color} opacity-70`
                            : 'border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <StatCard icon={Users} label="Total signups" value={waitlist.summary?.total ?? 0} />
            <StatCard icon={Clock} label="Pending" value={waitlist.summary?.pending ?? 0} />
            <StatCard icon={Mail} label="Invited" value={waitlist.summary?.invited ?? 0} />
            <StatCard icon={Ticket} label="Active" value={waitlist.summary?.active ?? 0} />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleExport('waitlist', 'suprema-waitlist.csv')}
              disabled={exporting === 'waitlist'}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {exporting === 'waitlist'
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />}
              Export CSV
            </button>
          </div>

          {waitlist.leads.length === 0 ? (
            <EmptyState icon={ListOrdered} title="No signups yet" hint="Waitlist registrations will appear here in queue order." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/60">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-zinc-500">
                    <th className="px-4 py-3 font-bold">#</th>
                    <th className="px-4 py-3 font-bold">Email</th>
                    <th className="px-4 py-3 font-bold">Referral</th>
                    <th className="px-4 py-3 font-bold">Joined</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.leads.map((l) => (
                    <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-bold text-zinc-500">
                        {l.queue_position ? `#${l.queue_position}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${l.email}`} className="text-zinc-200 underline-offset-2 hover:underline">
                          {l.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-400">{l.referral_code || '—'}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatDate(l.created_at)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status}
                          onChange={(e) => changeWaitlistStatus(l.id, e.target.value)}
                          aria-label={`Status for ${l.email}`}
                          className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-xs font-semibold text-zinc-300 focus:border-white/25 focus:outline-none"
                        >
                          {Object.entries(WAITLIST_STATUS).map(([value, cfg]) => (
                            <option key={value} value={value}>{cfg.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}