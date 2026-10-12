import React, { useState, useEffect, useCallback } from 'react';
import {
  GitCommitVertical, Plus, Pencil, Trash2, Loader2, AlertCircle,
  CheckCircle2, RefreshCw, X, Search
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../components/toast/ToastContext';

/**
 * Changelog Manager — the editorial side of the public changelog.
 *
 * The public page at /changelog reads the same rows, ordered newest first, so
 * what is written here appears on the marketing site immediately.
 */

const BADGE_COLORS = [
  { value: 'text-emerald-400', label: 'Green', swatch: 'bg-emerald-400' },
  { value: 'text-blue-400', label: 'Blue', swatch: 'bg-blue-400' },
  { value: 'text-amber-400', label: 'Amber', swatch: 'bg-amber-400' },
  { value: 'text-purple-400', label: 'Purple', swatch: 'bg-purple-400' },
  { value: 'text-rose-400', label: 'Rose', swatch: 'bg-rose-400' },
  { value: 'text-zinc-400', label: 'Grey', swatch: 'bg-zinc-400' }
];

const EMPTY_FORM = {
  tagId: '',
  releaseDate: new Date().toISOString().slice(0, 10),
  badge: 'New',
  badgeColor: 'text-emerald-400',
  title: '',
  description: '',
  subItemTitle: '',
  subItemDescription: '',
  tag: '',
  bannerTitle: '',
  bullets: '',
  note: ''
};

/**
 * The API returns bullets as an array; the form edits them as one-per-line,
 * which is how a person actually writes them.
 */
const toFormBullets = (bullets) => (Array.isArray(bullets) ? bullets.join('\n') : bullets || '');

const toPayload = (form) => ({
  tagId: form.tagId.trim(),
  releaseDate: form.releaseDate,
  badge: form.badge.trim() || 'New',
  badgeColor: form.badgeColor,
  title: form.title.trim(),
  description: form.description.trim() || null,
  subItemTitle: form.subItemTitle.trim() || null,
  subItemDescription: form.subItemDescription.trim() || null,
  tag: form.tag.trim() || null,
  bannerTitle: form.bannerTitle.trim() || null,
  // One bullet per line; the API turns it into the JSON array it stores.
  bullets: form.bullets.trim(),
  note: form.note.trim() || null
});

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-zinc-600">{hint}</span>}
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-zinc-800/60 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30';

export default function AdminChangelogPage() {
  const toast = useToast();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // tagId being edited, or 'new'
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/changelogs');
      setEntries(res.changelogs || []);
    } catch (err) {
      setError(err.data?.message || err.message || 'Could not load the changelog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setEditing('new');
  };

  const openEdit = (entry) => {
    setForm({
      tagId: entry.tag_id,
      releaseDate: entry.release_date ? new Date(entry.release_date).toISOString().slice(0, 10) : '',
      badge: entry.badge || 'New',
      badgeColor: entry.badge_color || 'text-emerald-400',
      title: entry.title || '',
      description: entry.description || '',
      subItemTitle: entry.sub_item_title || '',
      subItemDescription: entry.sub_item_description || '',
      tag: entry.tag || '',
      bannerTitle: entry.banner_title || '',
      bullets: toFormBullets(entry.bullets),
      note: entry.note || ''
    });
    setFormError('');
    setEditing(entry.tag_id);
  };

  const closeForm = () => {
    setEditing(null);
    setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.tagId.trim()) {
      setFormError('A version tag is required, for example v1.4.0.');
      return;
    }
    if (!form.title.trim()) {
      setFormError('A title is required.');
      return;
    }
    if (!form.releaseDate) {
      setFormError('A release date is required so the entry sorts correctly.');
      return;
    }

    setSaving(true);
    try {
      const payload = toPayload(form);
      const res = editing === 'new'
        ? await api.post('/admin/changelogs', payload)
        : await api.put(`/admin/changelogs/${encodeURIComponent(editing)}`, payload);

      toast.success(res.message || 'Changelog updated.');
      closeForm();
      await load();
    } catch (err) {
      setFormError(err.data?.message || err.message || 'Could not save that entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Delete ${entry.tag_id} from the changelog?\n\nThis removes it from the public changelog immediately.`
    );
    if (!confirmed) return;

    setDeleting(entry.tag_id);
    try {
      const res = await api.delete(`/admin/changelogs/${encodeURIComponent(entry.tag_id)}`);
      toast.success(res.message || 'Entry deleted.');
      await load();
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Could not delete that entry.');
    } finally {
      setDeleting('');
    }
  };

  const visible = entries.filter((e) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.tag_id?.toLowerCase().includes(q) ||
      e.tag?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Changelog Manager</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Entries published here appear on the public changelog, newest first.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-xs font-bold text-black transition hover:bg-zinc-200"
          >
            <Plus className="h-3.5 w-3.5" />
            New entry
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-2xl border border-white/12 bg-zinc-900/70 p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              {editing === 'new' ? 'New changelog entry' : `Editing ${editing}`}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close editor"
              className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Version tag" hint="Letters, numbers, dots, dashes. Must be unique.">
              <input
                value={form.tagId}
                onChange={(e) => setForm({ ...form, tagId: e.target.value })}
                placeholder="v1.4.0"
                disabled={editing !== 'new'}
                className={`${inputClass} disabled:opacity-60`}
              />
            </Field>

            <Field label="Release date" hint="Decides the ordering on the public page.">
              <input
                type="date"
                value={form.releaseDate}
                onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Badge" hint="Short label such as New, Improved, Fixed.">
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="New"
                className={inputClass}
              />
            </Field>

            <Field label="Badge colour">
              <div className="flex flex-wrap gap-2">
                {BADGE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, badgeColor: c.value })}
                    title={c.label}
                    aria-label={c.label}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                      form.badgeColor === c.value
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/10 text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${c.swatch}`} />
                    {c.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Improved Task Assignment Features"
              className={inputClass}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Highlight title (optional)">
              <input
                value={form.subItemTitle}
                onChange={(e) => setForm({ ...form, subItemTitle: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Category tag (optional)">
              <input
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Productivity"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Highlight description (optional)">
            <textarea
              value={form.subItemDescription}
              onChange={(e) => setForm({ ...form, subItemDescription: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </Field>

          <Field label="Bullets" hint="One per line. These become the list on the public entry.">
            <textarea
              value={form.bullets}
              onChange={(e) => setForm({ ...form, bullets: e.target.value })}
              rows={4}
              placeholder={'Assign tasks to multiple people at once\nDeadline warnings in list view\nKeyboard shortcuts for filtering'}
              className={inputClass}
            />
          </Field>

          <Field label="Banner title (optional)">
            <input
              value={form.bannerTitle}
              onChange={(e) => setForm({ ...form, bannerTitle: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Note (optional)">
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </Field>

          {formError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-xs font-bold text-black transition hover:bg-zinc-200 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              {editing === 'new' ? 'Publish entry' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="h-10 rounded-lg border border-white/10 px-4 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      {!editing && entries.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, version or category"
            className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading changelog…
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-white/12 bg-zinc-900/30 px-6 py-14 text-center">
          <GitCommitVertical className="mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-sm font-semibold text-zinc-300">
            {entries.length === 0 ? 'No changelog entries yet' : 'Nothing matches that search'}
          </p>
          {entries.length === 0 && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-zinc-200"
            >
              Write the first entry
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((entry) => (
            <li
              key={entry.tag_id}
              className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 transition hover:border-white/15"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">{entry.tag_id}</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                      {entry.badge || 'New'}
                    </span>
                    {entry.tag && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
                        {entry.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-white">{entry.title}</p>
                  {entry.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">{entry.description}</p>
                  )}
                  {Array.isArray(entry.bullets) && entry.bullets.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {entry.bullets.slice(0, 3).map((b, i) => (
                        <li key={i} className="text-[11px] text-zinc-500">• {b}</li>
                      ))}
                      {entry.bullets.length > 3 && (
                        <li className="text-[11px] text-zinc-600">+{entry.bullets.length - 3} more</li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <span className="mr-2 text-[11px] text-zinc-500">{formatDate(entry.release_date)}</span>
                  <button
                    type="button"
                    onClick={() => openEdit(entry)}
                    aria-label={`Edit ${entry.tag_id}`}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry)}
                    disabled={deleting === entry.tag_id}
                    aria-label={`Delete ${entry.tag_id}`}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    {deleting === entry.tag_id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}