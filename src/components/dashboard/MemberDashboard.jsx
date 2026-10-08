import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  FolderKanban,
  AlarmClock,
  CheckCircle2,
  LayoutDashboard,
  Activity as ActivityIcon
} from 'lucide-react';
import {
  DashboardShell,
  DashboardBanner,
  StatCard,
  SectionCard,
  SectionLink,
  ProgressBar,
  PriorityPill,
  StatusPill,
  ActivityFeed,
  EmptyState,
  LoadingBlock
} from './DashboardShell';
import useDashboardData from '../../hooks/useDashboardData';
import { useAuth } from '../../context/AuthContext';

/**
 * Member / Viewer portal.
 *
 * Focus: "what is mine". Deliberately personal metrics only - a member should
 * never be shown workspace-wide numbers they have no power to act on.
 */
export default function MemberDashboard() {
  const { user } = useAuth();
  const {
    workspaceName, tasks, loading, error, overdue, completionRate, activeProjects, activities
  } = useDashboardData();

  const firstName = user?.name?.split(' ')[0] || 'there';

  const myTasks = tasks
    .filter((t) => t.assignee_id === user?.id || t.created_by === user?.id)
    .sort((a, b) => {
      // Overdue first, then by status weight, then most recently due.
      const rank = { in_progress: 0, todo: 1, review: 2, backlog: 3, done: 4 };
      const aOver = a.due_date && new Date(a.due_date) < new Date() && a.status !== 'done';
      const bOver = b.due_date && new Date(b.due_date) < new Date() && b.status !== 'done';
      if (aOver !== bOver) return aOver ? -1 : 1;
      const byStatus = (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
      if (byStatus !== 0) return byStatus;
      return String(a.due_date || '9999').localeCompare(String(b.due_date || '9999'));
    });

  const openMine = myTasks.filter((t) => t.status !== 'done');
  const doneMine = myTasks.filter((t) => t.status === 'done');

  return (
    <DashboardShell tier="member">
      <DashboardBanner
        eyebrow="Member Workspace"
        title={`Welcome back, ${firstName}`}
        subtitle="Your assigned work, deadlines, and the projects you're contributing to."
        chips={[{ label: workspaceName || 'No workspace', title: 'Active workspace' }]}
        actions={[
          { to: '/dashboard/tasks', label: 'Open my board', icon: <CheckSquare className="h-4 w-4" /> },
          { to: '/dashboard/projects', label: 'All projects', icon: <FolderKanban className="h-4 w-4" /> }
        ]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Assigned to me"
          value={openMine.length}
          hint={openMine.length ? 'Open tasks in your queue' : 'Nothing waiting on you'}
          icon={<CheckSquare className="h-4 w-4" />}
          tone="accent"
          loading={loading}
        />
        <StatCard
          label="Overdue"
          value={overdue}
          hint={overdue ? 'Past the due date' : 'You are on schedule'}
          icon={<AlarmClock className="h-4 w-4" />}
          tone={overdue ? 'danger' : 'neutral'}
          loading={loading}
        />
        <StatCard
          label="Completed by me"
          value={doneMine.length}
          hint={`${completionRate}% of workspace done`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="positive"
          loading={loading}
        />
        <StatCard
          label="Active projects"
          value={activeProjects.length}
          hint="Projects you can see"
          icon={<FolderKanban className="h-4 w-4" />}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="My task queue"
            icon={<CheckSquare className="h-4 w-4" />}
            action={<SectionLink to="/dashboard/tasks" label="Open board" />}
          >
            {loading ? (
              <LoadingBlock label="Loading your tasks..." />
            ) : error ? (
              <EmptyState title="Could not load your tasks" hint={error} />
            ) : openMine.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="h-6 w-6" />}
                title="Nothing is waiting on you"
                hint="When a teammate assigns you work it will appear here, highest priority first."
              />
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {openMine.slice(0, 6).map((task) => {
                  const isOverdue =
                    task.due_date && new Date(task.due_date) < new Date();

                  return (
                    <li
                      key={task.id}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{
                            background:
                              task.status === 'in_progress' ? 'var(--accent)' : '#3f3f46',
                          }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">
                            {task.title}
                          </p>
                          <p className="truncate text-[11px] text-zinc-500">
                            {isOverdue ? (
                              <span className="text-red-400">
                                Overdue ·{' '}
                                {new Date(task.due_date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            ) : task.due_date ? (
                              `Due ${new Date(task.due_date).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              })}`
                            ) : (
                              'No due date'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <PriorityPill priority={task.priority} />
                        <StatusPill status={task.status} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Projects I'm working on"
            icon={<FolderKanban className="h-4 w-4" />}
            action={<SectionLink to="/dashboard/projects" label="All projects" />}
          >
            {loading ? (
              <LoadingBlock />
            ) : activeProjects.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-6 w-6" />}
                title="No active projects"
                hint="Projects created in this workspace will show up here."
              />
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeProjects.slice(0, 4).map((project) => {
                  const pct =
                    project.total_tasks > 0
                      ? Math.round((project.completed_tasks / project.total_tasks) * 100)
                      : 0;

                  return (
                    <li
                      key={project.id}
                      className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: project.color || 'var(--accent)' }}
                          />
                          <span className="truncate text-xs font-bold text-white">
                            {project.name}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-zinc-300">
                          {project.status}
                        </span>
                      </div>
                      <div className="mb-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Completion</span>
                        <span className="font-bold tabular-nums text-white">{pct}%</span>
                      </div>
                      <ProgressBar value={pct} />
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Recent team activity"
            icon={<ActivityIcon className="h-4 w-4" />}
            action={<SectionLink to="/dashboard/activity" label="View all" />}
          >
            <ActivityFeed activities={activities} limit={8} emptyHint="Nothing has happened yet." />
          </SectionCard>

          <SectionCard title="Quick links" icon={<LayoutDashboard className="h-4 w-4" />}>
            <div className="space-y-2">
              {[
                { to: '/dashboard/tasks', label: 'Tasks board', hint: 'Kanban view of all work' },
                { to: '/dashboard/teams', label: 'Teams', hint: 'See who you work with' },
                { to: '/dashboard/activity', label: 'Activity feed', hint: 'Full workspace history' }
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 transition-colors hover:border-[color:var(--accent-ring)]"
                >
                  <span>
                    <span className="block text-xs font-semibold text-white">{l.label}</span>
                    <span className="block text-[11px] text-zinc-500">{l.hint}</span>
                  </span>
                  <span className="text-zinc-600">→</span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}