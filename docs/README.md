# Suprema Documentation

Complete guides for everyone who uses or builds Suprema — the task management
platform for teams.

| Guide | Who it is for | What it covers |
| --- | --- | --- |
| [User Guide](USER_GUIDE.md) | Members, viewers, anyone who logs in to do work | Signing in, projects, tasks, calendar, teams, search, everyday workflows |
| [Admin Guide](ADMIN_GUIDE.md) | `super_admin`, `admin`, `developer` | User management, roles, passwords, broadcasts, audit trail, security duties |
| [Developer Guide](DEVELOPER_GUIDE.md) | New engineers joining the project | Local setup, architecture, database, full API reference, deployment |
| [Video Script](VIDEO_SCRIPT.md) | Whoever records the walkthrough | Shot-by-shot recording plan with narration and timings |

## Suprema in one paragraph

Suprema is a multi-tenant task management platform. Every piece of work belongs
to a **workspace**, and a workspace contains **projects**, **tasks**,
**teams** and **members**. Tasks move through a four-stage workflow
(`To Do → In Progress → In Review → Done`), carry a priority and a deadline,
and support subtasks, comments, file attachments and time tracking. Administrators
manage the whole platform from a separate staff portal.

## Roles at a glance

| Role | Sees | Can do |
| --- | --- | --- |
| `super_admin` | Everything | All admin actions **plus** permanently delete users |
| `admin` | Everything | Manage users, roles, passwords, status, broadcasts |
| `developer` | Everything | Same user-management powers as `admin` |
| `member` | Assigned work | Full project and task work in their workspaces |
| `viewer` | Assigned work | Read and comment; not a task owner |

Two role systems exist and are easy to confuse:

- **Platform role** — who you are across all of Suprema (the table above).
- **Workspace role** — your permission inside one workspace: `owner`, `admin`,
  `member`, `guest`.

## The three entry points

| Address | Purpose |
| --- | --- |
| `/` | Public marketing site — home, pricing, blogs, changelog, contact, waitlist |
| `/login` | Sign in for members |
| `/admin-login` | Sign in for staff (also reachable at `/staff-portal`) |

Staff use `/admin-login`; it is intentionally a separate door from the member
login so the two audiences never mix.

## Live deployments

| Service | Address |
| --- | --- |
| Frontend | `https://superma-task-management.vercel.app` |
| Backend API | `https://superma-task-management-37zl.vercel.app/api/v1` |
| Health check | `https://superma-task-management-37zl.vercel.app/api/v1/health` |

> **Before any demonstration, check the health endpoint.** It must report
> `"database":"CONNECTED"`. The database is hosted on a free-tier provider that
> powers itself off when idle; if it is asleep, database-backed pages will fail
> until it is powered back on. See the
> [troubleshooting section](DEVELOPER_GUIDE.md#troubleshooting).

## Demo accounts

The seeded accounts exist so you can explore each role. Passwords are **not**
written in this repository on purpose — request them from the project team, and
change them before demonstrating anything publicly.

| Email | Platform role | Useful for |
| --- | --- | --- |
| `admin@suprema.io` | `super_admin` | Everything, including user deletion |
| `developer@suprema.io` | `developer` | Staff build view and workload tools |
| `sarah@suprema.io` | `member` | The normal member experience |
| `alex@suprema.io` | `member` | A second member, for collaboration views |
| `client@suprema.io` | `viewer` | The restricted, read-mostly experience |

## Contributing to the docs

Keep these three properties and the docs stay useful:

1. **Verify before you document.** Every endpoint and screen here was read from
   the code. If behaviour changes, update the same commit.
2. **Never write a real secret into these files.** No passwords, no API keys.
3. **Write for the least technical reader in the section.** Avoid jargon, or
   define it the first time it appears.