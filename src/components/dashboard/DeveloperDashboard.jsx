import React from 'react';
import {
  CheckSquare,
  Timer,
  Gauge,
  Users,
  LayoutList,
  Activity as ActivityIcon,
  Terminal,
  CircleDot
} from 'lucide-react';
import {
  DashboardShell,
  DashboardBanner,
  StatCard,
  SectionCard,
  SectionLink,
  ProgressBar,
  ActivityFeed,
  EmptyState,
  LoadingBlock
} from './DashboardShell';
import useDashboardData from '../../hooks/useDashboardData';
import { useAuth } from '../../context/AuthContext';

const STATUS_ORDER = ['backlog', 'todo', 'review', 'in_progress', 'done'];

/**
 * Developer / Engineer portal.
 *
 * Focus: throughput and workload, not identity. The question a developer asks
 * on opening this is "what is the state of the board and who is drowning",
 * which is deliberately different from both the member and admin questions.
 */
export default function DeveloperDashboard() {
  const { user } = useAuth();
  const {
    workspaceName, tasks, teams, loading, error, counts, workload, completionRate,
    activeProjects, activities
  } = useDashboardData();

  const pipelineTotal = STATUS_ORDER.reduce(
    (sum, key) => sum + (counts[key] || 0),
    0
  );

  const busiest = workload[0];
  const unassigned = tasks.filter((t) => !t.assignee_id && t.status !== 'done').length;

  return (
    <DashboardShell tier="developer">
      <DashboardBanner
        eyebrow="Engineering Console"
        title={`Build view · ${user?.name?.split(' ')[0] || 'Developer'}`}
        subtitle="Board throughput, workload distribution, and what needs attention next."
        chips={[
          { label: workspaceName || 'No workspace' },
          { label: 'RBAC: developer', title: 'Your access level' }
        ]}
        actions={[
          { to: '/dashboard/tasks', label: 'Open board', icon: <LayoutList className="h-4 w-4" /> },
          { to: '/dashboard/activity', label: 'Activity log', icon: <ActivityIcon className="h-4 w-4" /> }
        ]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Cards on board"
          value={tasks.length}
          hint={`${pipelineTotal} across all columns`}
          icon={<LayoutList className="h-4 w-4" />}
          tone="accent"
          loading={loading}
        />
        <StatCard
          label="In progress"
          value={counts.in_progress || 0}
          hint="Actively being worked"
          icon={<Timer className="h-4 w-4" />}
          tone="warning"
          loading={loading}
        />
        <StatCard
          label="Throughput"
          value={`${completionRate}%`}
          hint={`${counts.done} completed of ${tasks.length}`}
          icon={<Gauge className="h-4 w-4" />}
          tone="positive"
          loading={loading}
        />
        <StatCard
          label="Unassigned"
          value={unassigned}
          hint={unassigned ? 'Open work with no owner' : 'Everything is claimed'}
          icon={<CircleDot className="h-4 w-4" />}
          tone={unassigned ? 'danger' : 'neutral'}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Board pipeline"
            icon={<LayoutList className="h-4 w-4" />}
            action={<SectionLink to="/dashboard/tasks" label="Manage board" />}
          >
            {loading ? (
              <LoadingBlock />
            ) : error ? (
              <EmptyState title="Could not load the board" hint={error} />
            ) : tasks.length === 0 ? (
              <EmptyState
                icon={<LayoutList className="h-6 w-6" />}
                title="The board is empty"
                hint="Create your first task from the Tasks Board to get the pipeline moving."
              />
            ) : (
              <ul className="space-y-3">
                {STATUS_ORDER.map((key) => {
                  const value = counts[key] || 0;
                  const pct = tasks.length ? (value / tasks.length) * 100 : 0;

                  return (
                    <li key={key} className="flex items-center gap-4">
                      <span className="w-24 shrink-0 text-[11px] font-semibold capitalize text-zinc-400">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <div className="flex-1">
                        <ProgressBar value={pct} />
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs font-bold tabular-nums text-white">
                        {value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Team workload"
            icon={<Users className="h-4 w-4" />}
            action={
              <span className="text-[11px] text-zinc-500">
                {teams.length} team{teams.length === 1 ? '' : 's'}
              </span>
            }
          >
            {loading ? (
              <LoadingBlock />
            ) : workload.length === 0 ? (
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No assigned work yet"
                hint="Assign tasks to teammates and their workload will be tracked here."
              />
            ) : (
              <ul className="space-y-3">
                {workload.slice(0, 6).map((person) => {
                  const total = person.open + person.done;
                  const pct = total ? (person.open / total) * 100 : 0;
                  const isHot = busiest && person.id === busiest.id && person.open > 3;

                  return (
                    <li key={person.id} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-[10px] font-black text-white">
                        {person.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-baseline justify-between gap-2">
                          <span className="truncate text-xs font-semibold text-white">
                            {person.name}
                          </span>
                          <span className="shrink-0 text-[11px] tabular-nums text-zinc-400">
                            <span className="text-amber-400">{person.open} open</span>
                            {' · '}
                            <span className="text-emerald-400">{person.done} done</span>
                          </span>
                        </div>
                        <ProgressBar value={pct} />
                      </div>
                      {isHot && (
                        <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-400">
                          Heaviest
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Active projects"
            icon={<CheckSquare className="h-4 w-4" />}
            action={<SectionLink to="/dashboard/projects" label="All projects" />}
          >
            {loading ? (
              <LoadingBlock />
            ) : activeProjects.length === 0 ? (
              <EmptyState title="No active projects" hint="Create a project to start tracking work." />
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeProjects.slice(0, 4).map((project) => {
                  const pct =
                    project.total_tasks > 0
                      ? Math.round((project.completed_tasks / project.total_tasks) * 100)
                      : 0;
                  return (
                    <li key={project.id} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: project.color || 'var(--accent)' }}
                          />
                          <span className="truncate text-xs font-bold text-white">{project.name}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-zinc-300">
                          {project.status}
                        </span>
                      </div>
                      <div className="mb-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">
                          {project.completed_tasks}/{project.total_tasks} tasks
                        </span>
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
          <SectionCard title="Developer notes" icon={<Terminal className="h-4 w-4" />}>
            <ul className="space-y-3 text-[11px] text-zinc-400">
              {[
                `Access level: developer - full admin API, deletion restricted to super admin.`,
                `${unassigned} card${unassigned === 1 ? '' : 's'} currently have no assignee.`,
                busiest
                  ? `${busiest.name} is carrying the heaviest open load (${busiest.open}).`
                  : 'No open workload detected.'
              ].map((note, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Recent activity"
            icon={<ActivityIcon className="h-4 w-4" />}
            action={<SectionLink to="/dashboard/activity" label="View all" />}
          >
            <ActivityFeed activities={activities} limit={8} emptyHint="No activity recorded yet." />
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}