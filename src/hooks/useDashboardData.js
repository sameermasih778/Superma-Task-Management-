import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getDashboardCache, setDashboardCache } from '../utils/dashboardCache';

/**
 * Shared data loader for the role-aware dashboards with SWR in-memory caching.
 *
 * All three dashboards need the same workspace-scoped facts (projects, tasks,
 * teams, activity).
 *
 * SWR (Stale-While-Revalidate) pattern ensures:
 * 1. 0ms instant render from memory cache when switching tabs.
 * 2. Silent background synchronization without flashing spinners.
 * 3. Immediate responsive feeling across all dashboard roles.
 */
export default function useDashboardData() {
  const { activeWorkspace, user } = useAuth();
  const isStaff = ['super_admin', 'admin', 'developer'].includes(user?.role);
  const wsId = activeWorkspace?.id;

  const initialCache = getDashboardCache(wsId);

  const [projects, setProjects] = useState(() => initialCache?.data?.projects || []);
  const [tasks, setTasks] = useState(() => initialCache?.data?.tasks || []);
  const [teams, setTeams] = useState(() => initialCache?.data?.teams || []);
  const [activities, setActivities] = useState(() => initialCache?.data?.activities || []);
  const [loading, setLoading] = useState(() => !initialCache?.data);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(() => initialCache?.timestamp || Date.now());

  // Track workspace switches
  const prevWsIdRef = useRef(wsId);
  useEffect(() => {
    if (prevWsIdRef.current !== wsId) {
      prevWsIdRef.current = wsId;
      const cached = getDashboardCache(wsId);
      if (cached?.data) {
        setProjects(cached.data.projects || []);
        setTasks(cached.data.tasks || []);
        setTeams(cached.data.teams || []);
        setActivities(cached.data.activities || []);
        setLoading(false);
      } else {
        setProjects([]);
        setTasks([]);
        setTeams([]);
        setActivities([]);
        setLoading(true);
      }
    }
  }, [wsId]);

  const fetchData = useCallback(async (options = {}) => {
    const { force = false } = options;
    if (!activeWorkspace?.id) {
      setLoading(false);
      return;
    }

    const ws = activeWorkspace.id;
    const cached = getDashboardCache(ws);

    // If fresh data is already cached and not forced, skip network completely
    if (cached?.isFresh && !force) {
      setProjects(cached.data.projects || []);
      setTasks(cached.data.tasks || []);
      setTeams(cached.data.teams || []);
      setActivities(cached.data.activities || []);
      setLoading(false);
      return;
    }

    // Only show loading indicator if there is NO cached data to show
    if (!cached?.data) {
      setLoading(true);
    }
    setError(null);

    try {
      // Parallelise the workspace reads, but settle them individually
      const [projRes, taskRes, teamRes] = await Promise.allSettled([
        api.get(`/projects?workspace_id=${ws}`),
        api.get(`/tasks?workspace_id=${ws}`),
        api.get(`/teams?workspace_id=${ws}`)
      ]);

      const nextProjects = projRes.status === 'fulfilled' ? projRes.value.projects || [] : (cached?.data?.projects || []);
      const nextTasks = taskRes.status === 'fulfilled' ? taskRes.value.tasks || [] : (cached?.data?.tasks || []);
      const nextTeams = teamRes.status === 'fulfilled' ? teamRes.value.teams || [] : (cached?.data?.teams || []);

      setProjects(nextProjects);
      setTasks(nextTasks);
      setTeams(nextTeams);

      const failed = [projRes, taskRes, teamRes].filter((r) => r.status === 'rejected');
      if (failed.length === 3 && !cached?.data) {
        setError(failed[0].reason?.message || 'Failed to load workspace data');
      }

      let nextActivities = cached?.data?.activities || [];
      if (isStaff) {
        try {
          const actRes = await api.get(`/activity?workspace_id=${ws}`);
          nextActivities = actRes.activities || [];
          setActivities(nextActivities);
        } catch {
          // Keep whatever activity we have
        }
      } else {
        nextActivities = [];
        setActivities([]);
      }

      const now = Date.now();
      setFetchedAt(now);

      // Persist into memory SWR cache
      setDashboardCache(ws, {
        projects: nextProjects,
        tasks: nextTasks,
        teams: nextTeams,
        activities: nextActivities
      });
    } catch (err) {
      if (!cached?.data) {
        setError(err.message || 'Failed to load workspace data');
      }
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, isStaff]);

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
    refresh: (force = true) => fetchData({ force: Boolean(force) }),
    counts,
    overdue,
    workload: Object.values(workload).sort((a, b) => b.open - a.open),
    completionRate,
    activeProjects,
  };
}