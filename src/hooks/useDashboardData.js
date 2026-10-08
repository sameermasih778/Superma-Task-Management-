import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Shared data loader for the role-aware dashboards.
 *
 * All three dashboards need the same workspace-scoped facts (projects, tasks,
 * teams, activity). Fetching them per-dashboard duplicated ~40 lines three
 * times and, more importantly, duplicated the failure handling - which is how
 * one dashboard silently rendered zeros while another surfaced an error.
 *
 * Returns derived counts alongside the raw collections so the dashboards do not
 * each re-implement the same reductions.
 */
export default function useDashboardData() {
  const { activeWorkspace } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Captured when data is fetched rather than read during render, so the
  // overdue calculation is a pure function of state (React Compiler enforces
  // this, and it also stops the count flickering mid-session).
  const [fetchedAt, setFetchedAt] = useState(() => Date.now());

  const fetchData = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ws = activeWorkspace.id;

      // Parallelise - these are independent reads.
      const [projRes, taskRes, teamRes, actRes] = await Promise.all([
        api.get(`/projects?workspace_id=${ws}`),
        api.get(`/tasks?workspace_id=${ws}`),
        api.get(`/teams?workspace_id=${ws}`),
        api.get(`/activity?workspace_id=${ws}`)
      ]);

      setProjects(projRes.projects || []);
      setTasks(taskRes.tasks || []);
      setTeams(teamRes.teams || []);
      setActivities(actRes.activities || []);
      setFetchedAt(Date.now());
    } catch (err) {
      setError(err.message || 'Failed to load workspace data');
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Derived metrics ─────────────────────────────────────────── */

  const counts = tasks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      if (t.status === 'done') acc.done += 1;
      return acc;
    },
    { done: 0, in_progress: 0, todo: 0, backlog: 0, review: 0 }
  );

  const now = fetchedAt;
  const overdue = tasks.filter(
    (t) => t.status !== 'done' && t.due_date && new Date(t.due_date).getTime() < now
  ).length;

  // Workload per assignee, used by the developer dashboard.
  const workload = tasks.reduce((map, t) => {
    if (!t.assignee_id) return map;
    const key = t.assignee_id;
    if (!map[key]) {
      map[key] = {
        id: key,
        name: t.assignee_name || `User #${key}`,
        avatar: t.assignee_avatar,
        open: 0,
        done: 0,
      };
    }
    if (t.status === 'done') map[key].done += 1;
    else map[key].open += 1;
    return map;
  }, {});

  const completionRate = tasks.length ? Math.round((counts.done / tasks.length) * 100) : 0;

  const activeProjects = projects.filter(
    (p) => p.status === 'active' || p.status === 'planning'
  );

  return {
    workspaceId: activeWorkspace?.id,
    workspaceName: activeWorkspace?.name,
    projects,
    tasks,
    teams,
    activities,
    loading,
    error,
    refresh: fetchData,
    counts,
    overdue,
    workload: Object.values(workload).sort((a, b) => b.open - a.open),
    completionRate,
    activeProjects,
  };
}