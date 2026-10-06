import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FolderKanban, CheckSquare, Users, ArrowRight, CornerDownLeft } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [], teams: [] });
  const [searching, setSearching] = useState(false);
  const { activeWorkspace } = useAuth();
  const navigate = useNavigate();

  // Keyboard shortcut listener for ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced Search Request
  useEffect(() => {
    if (!query.trim() || !activeWorkspace?.id) {
      setResults({ projects: [], tasks: [], teams: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const [projRes, taskRes, teamRes] = await Promise.all([
          api.get(`/projects?workspace_id=${activeWorkspace.id}`),
          api.get(`/tasks?workspace_id=${activeWorkspace.id}`),
          api.get(`/teams?workspace_id=${activeWorkspace.id}`)
        ]);

        const q = query.toLowerCase();

        const filteredProjs = (projRes.projects || []).filter(
          p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
        );

        const filteredTasks = (taskRes.tasks || []).filter(
          t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
        );

        const filteredTeams = (teamRes.teams || []).filter(
          tm => tm.name.toLowerCase().includes(q) || (tm.description && tm.description.toLowerCase().includes(q))
        );

        setResults({
          projects: filteredProjs.slice(0, 4),
          tasks: filteredTasks.slice(0, 5),
          teams: filteredTeams.slice(0, 3)
        });
      } catch (err) {
        console.warn('Global search fetch error:', err.message);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, activeWorkspace?.id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-950 border border-white/15 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Top Search Input Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-zinc-900/60">
            <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tasks, or team members... (type to search)"
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-zinc-500 hover:text-white text-xs p-1 rounded-md"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results Container */}
          <div className="p-4 max-h-[420px] overflow-y-auto space-y-5">
            {!query.trim() ? (
              <div className="py-8 text-center space-y-2">
                <Search className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400 font-medium">Type a search term above to find projects, tasks, or teams.</p>
                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-2">
                  <span className="bg-zinc-900 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono">ESC</span>
                  <span>to close</span>
                </div>
              </div>
            ) : searching ? (
              <div className="py-8 text-center text-xs text-zinc-500">Searching workspace...</div>
            ) : (results.projects.length === 0 && results.tasks.length === 0 && results.teams.length === 0) ? (
              <div className="py-8 text-center text-xs text-zinc-500">No matching results found for "{query}".</div>
            ) : (
              <>
                {/* Projects Category */}
                {results.projects.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2 px-2">
                      Projects ({results.projects.length})
                    </span>
                    <div className="space-y-1">
                      {results.projects.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate('/dashboard/projects');
                            onClose();
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:bg-zinc-800 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || '#6366f1' }} />
                            <div>
                              <p className="text-xs font-bold text-white">{p.name}</p>
                              <p className="text-[10px] text-zinc-400 line-clamp-1">{p.description || 'Project'}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks Category */}
                {results.tasks.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2 px-2">
                      Tasks ({results.tasks.length})
                    </span>
                    <div className="space-y-1">
                      {results.tasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            navigate('/dashboard/tasks');
                            onClose();
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:bg-zinc-800 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckSquare className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white">{t.title}</p>
                              <p className="text-[10px] text-zinc-400 capitalize">Status: {t.status?.replace('_', ' ')} • Priority: {t.priority}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teams Category */}
                {results.teams.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2 px-2">
                      Teams ({results.teams.length})
                    </span>
                    <div className="space-y-1">
                      {results.teams.map(tm => (
                        <div
                          key={tm.id}
                          onClick={() => {
                            navigate('/dashboard/teams');
                            onClose();
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:bg-zinc-800 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-sky-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white">{tm.name}</p>
                              <p className="text-[10px] text-zinc-400">{tm.description || 'Workspace Team'}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-3 border-t border-white/10 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <CornerDownLeft className="w-3 h-3 text-indigo-400" />
              <span>Click any result to jump directly to page</span>
            </div>
            <span>Global Search v1.0</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
