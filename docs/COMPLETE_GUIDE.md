# Suprema — The Complete Guide

**One guide for everyone who uses or builds Suprema.**

Whether you have never opened the app before, you are an everyday member, you
run the platform as an administrator, or you write code against it — this
document teaches you what Suprema is, how to use it well, and how to keep it
healthy.

It is written from checked facts: every screen, rule and endpoint described
here was verified against the live application. Where a topic has a dedicated
in-depth guide, the section links to it — this guide stays the one document you
read first.

---

## How to use this guide

Pick your row and follow it. "Read" means from start to finish; "Skim" means
you can jump straight to the topic you need.

| You are... | Read | Skim if stuck |
| --- | --- | --- |
| Completely new / non-technical | Part 0, Part 1, Part 2 | Part 5, FAQ |
| A member or viewer doing work | Part 0, Part 2 | Part 5, Glossary |
| An administrator or staff member | Part 0, Part 3 | Part 5, FAQ |
| A developer or new engineer | Part 0, Part 4 | Part 5, Glossary |

Four dedicated guides go deeper into each area:

| Deep-dive guide | For | Coverage |
| --- | --- | --- |
| [User Guide](USER_GUIDE.md) | Members and viewers | Everyday tasks in detail |
| [Admin Guide](ADMIN_GUIDE.md) | Staff (`super_admin`, `admin`, `developer`) | Full administration duties |
| [Developer Guide](DEVELOPER_GUIDE.md) | Engineers | Architecture, API reference, deployment |
| [Video Script](VIDEO_SCRIPT.md) | Presenters | Shot-by-shot walkthrough plan |

---

# Part 0 — Understanding Suprema (for absolutely everyone)

## 0.1 What Suprema is

Suprema is a **team task-management platform**. It answers one question for a
team: *"what work exists, who owns it, and where does it stand right now?"*

Every piece of work belongs to a **workspace**. A workspace contains
**projects** (groups of related work), **tasks** (the individual pieces of
work), **teams** (the people working together) and **members** (the people).
Tasks move through a simple four-stage workflow and carry a priority and a
deadline, and they support subtasks, comments, file attachments and time
tracking. Administrators run the whole platform from a **separate staff
portal**, with an audit trail of everything that happens.

## 0.2 The core ideas in plain language

| Idea | What it is | Plain-language example |
| --- | --- | --- |
| **Workspace** | A sealed world where a team works — projects, tasks, teams, members | "The Marketing team's space" |
| **Project** | A group of related work | "Q1 Website Redesign" |
| **Task** | One piece of work with an owner, priority and deadline | "Checkout fails on Safari" |
| **Team** | A named group of people | "Content Writers" |
| **Stage** | Where a task is right now | `To Do → In Progress → In Review → Done` |
| **Priority** | How urgent work is | `Urgent / High / Medium / Low` |

## 0.3 The two role systems (easy to confuse — read this)

Suprema has **two separate permission systems** that work at the same time:

1. **Platform role** — who you are across all of Suprema:

   | Role | Sees | Can do |
   | --- | --- | --- |
   | `super_admin` | Everything | All admin actions **plus** permanently delete users |
   | `admin` | Everything | Manage users, roles, passwords, status, broadcasts |
   | `developer` | Everything | Same user-management powers as `admin` |
   | `member` | Their assigned work | Full project and task work in their workspaces |
   | `viewer` | Their assigned work | Read and comment; not a task owner |

2. **Workspace role** — your permission *inside one workspace*:
   `owner`, `admin`, `member`, `guest`.

They are independent: you can be a `member` platform-wide and an `owner` of one
specific workspace. When something says "you cannot do this", the cause is
almost always one of these two systems.

## 0.4 The three doors

Suprema has exactly three places to enter, on purpose:

| Address | Purpose |
| --- | --- |
| `/` | Public marketing site — home, pricing, blogs, changelog, contact, waitlist |
| `/login` | Sign in for members and viewers |
| `/admin-login` | Sign in for staff (also reachable at `/staff-portal`) |

The staff door is deliberately separate from the member door so the two
audiences never mix. There is **no self-signup for staff** — a staff account can
only be created by an administrator.

## 0.5 Where the live system lives

| Service | Address |
| --- | --- |
| Frontend (the site) | `https://superma-task-management.vercel.app` |
| Backend API | `https://superma-task-management-37zl.vercel.app/api/v1` |
| Health check | `https://superma-task-management-37zl.vercel.app/api/v1/health` |

> **Before any demonstration, open the health check.** It must report
> `"database":"CONNECTED"`. The database is hosted on a free tier that powers
> itself off when idle — if it is asleep, every login and data page fails until
> it is powered back on. See [Part 5.3](#53-the-database-is-asleep-the-1-most-common-problem).

---

# Part 1 — Non-technical quick start (new users, no experience needed)

## 1.1 Creating an account

1. Go to the site and click **Sign In → Create account**.
2. Enter your **name**, **email address** and a **password**.
3. Suprema emails you a **6-digit verification code** — valid for **10 minutes**.
4. Enter the code to finish. Your account is created and you are signed in.

> **No code arrived?** Check your spam folder first. Codes can take a few
> seconds. You can request a new one after a minute.

### Signing in with Google instead

On the sign-in page, click **Continue with Google**, choose your account, done.

- Your account is created automatically as a **member** on first use.
- If your email already exists, you keep the role you already had.
- **Google can never make you an administrator** — staff accounts can only be
  created by an administrator, by design.

## 1.2 Signing in and out, and forgotten passwords

| Task | Where |
| --- | --- |
| Members and viewers sign in | `/login` |
| Staff sign in | `/admin-login` |
| Sign out | **Sign Out** in the top bar |

**Forgot your password? You can fix it yourself — no administrator needed:**

1. On the sign-in page, click **Forgot your password?**
2. Enter your email and click **Send reset link**.
3. Open the email and click **Choose a new password**.
4. Pick a new one and sign in with it.

The link works **once** and expires after **30 minutes** — request a new one if
it has expired. If the email is not registered, you see the *same* confirmation
message; that is deliberate, so nobody can use the form to discover which
addresses have accounts.

## 1.3 Your first tour of the dashboard

The left sidebar is your navigation. Some items appear only for certain roles:

| Sidebar item | What it is for |
| --- | --- |
| **Overview** | Your landing page: your task queue and the projects you contribute to |
| **Projects** | Every project in the workspace, with progress |
| **Tasks Board** | All tasks — switch between Kanban and List |
| **Calendar** | Tasks plotted on their due dates |
| **Analytics** | Completion rate, hours, overdue work, workload per person |
| **Teams** | The teams in this workspace and their members |
| **Activity Feed** | A chronological log of what happened |
| **My Profile** | Your name, email, avatar, password (members and viewers) |
| **User Management** | Staff only — see [Part 3](#part-3--running-the-platform-administrators-and-staff) |

**Switching workspaces:** your workspace name sits at the top of the sidebar.
Click it to open the list and switch. *Everything you see belongs to the
workspace you currently have selected.*

## 1.4 The eight habits that make you faster (learn these first)

1. **Start in the week view.** Calendar first, then the board.
2. **Filter before you decide.** "Mine + Overdue" answers "what should I do today?"
3. **One click, not five.** Press `Ctrl + K` anywhere to jump straight to anything.
4. **Write titles as outcomes.** "Checkout fails on Safari" beats "Fix checkout".
5. **Always set a deadline.** Undated tasks quietly become overdue work.
6. **Log time as you go,** not at the end of the week.
7. **Use subtasks for anything over a day.** It makes progress visible.
8. **Check Analytics before a status meeting.** It is already written for you.

---

# Part 2 — Getting work done (members and viewers)

This is the complete everyday workflow. More detail lives in the
[User Guide](USER_GUIDE.md); everything here is accurate and sufficient to use
the platform well.

## 2.1 Projects

**Creating:** **Projects → New Project** → name + short description + status.

| Status | Meaning |
| --- | --- |
| Planning | Still being discussed |
| Active | Work is happening now |
| On hold | Paused deliberately |
| Completed | Finished |
| Archived | Closed and kept for the record |

**Good practice:** use a project for one outcome — "Q1 Website Redesign" — not
for a department. Small, focused projects make the Analytics numbers meaningful.

## 2.2 Tasks — the core of the platform

**Creating:** **Tasks Board → New Task**, or from inside a project. Give each
task:

- a **title** that says what "done" looks like
- an **assignee** (who is responsible)
- a **priority**
- a **deadline** (optional, but strongly recommended)
- optionally, which **project** it belongs to

**The four stages** — move a task by dragging it, or from the task drawer:

```
To Do → In Progress → In Review → Done
```

**Priorities:**

| Priority | Use it for |
| --- | --- |
| Urgent | Blocking someone, or a deadline is now |
| High | Needed this week |
| Medium | The default — normal work |
| Low | Nice to have |

**Two views — choose per job:**

- **Kanban** — columns per stage. Best for seeing flow at a glance and dragging
  cards between stages. Use it when you are deciding what to work on next.
- **List** — a table with subtask counts, inline status and priority controls,
  assignee avatars and deadline warnings. Best for scanning and bulk editing.
  Use it when you are checking status or deadlines.

**Filtering:** the filter bar narrows the board by **assignee**, **deadline**
(overdue, due today, this week, none), **priority**, and a text search of
titles and descriptions. Filters combine; **Reset** clears everything at once.

**Opening a task** — click it to open its drawer:

| Tab | Contents |
| --- | --- |
| **Subtasks** | Break the task into smaller steps |
| **Comments** | Discuss it with the team |
| **Attachments** | Upload files (images, documents) |

You can change **status**, **priority**, **assignee** and **deadline** right
from the drawer without leaving the task.

**Time tracking:** if a task has an estimated hour budget, log real time with
the quick buttons (**+0.5h, +1h, +2h**) or type an exact value. The tracker
shows progress against the estimate and warns when you go **over estimate**.
Every change is recorded in the activity log.

## 2.3 Calendar

`/dashboard/calendar` shows a month grid with tasks on their due dates. Today
is highlighted; off-month days are dimmed; colour badges show priority;
completed tasks are struck through.

**Efficient use:** glance at it at the start of each week. Anything red or
overdue is what you should deal with first. Filter by project to answer "what
is due for *this* project?", and click any task to update it in place.

## 2.4 Analytics

`/dashboard/analytics` answers "how is the team actually doing?":

| Card | Reads as |
| --- | --- |
| Completion rate | What share of work is finished |
| Hours logged vs estimated | Are we over or under budget |
| In progress / in review | What is moving right now |
| Overdue tasks | What has slipped |

Below: the status breakdown, the priority mix, and a **per-member workload
table** — the fastest way to spot who is overloaded or underused.

## 2.5 Teams

`/dashboard/teams` lists the workspace's teams and who belongs to each.

- **Staff and workspace admins** can create a team, add or remove members, and
  delete a team they own.
- **Members** can see teams and manage the ones they created.

If you cannot see an action on a team, you are not its owner and you are not an
administrator. Ask an administrator to do it or to make you a team leader.

## 2.6 Activity Feed

A running, timestamped record of what happened in the workspace — tasks
created, status changes, comments, membership changes. It answers *"when did
this change, and who changed it?"* without hunting through email. Staff open it
from the sidebar as its own page.

## 2.7 Finding anything fast (Ctrl + K)

Press **Ctrl + K** (or **⌘ + K** on a Mac) anywhere in the dashboard to open
**Global Search**. Type to search across **projects**, **tasks** and **teams**,
then use the arrow keys and Enter to jump straight to a result. This is the
fastest way to reach anything — faster than clicking through the sidebar.

## 2.8 Notifications and your profile

The **bell icon** shows notifications for work assigned to you, mentions,
system events and administrator announcements. Mark read notifications read,
individually or all at once.

**My Profile** lets you change your display name, upload or remove a profile
picture (a letter avatar appears if you do not add one), change your password,
and see which workspaces you belong to and your role in each.

---

# Part 3 — Running the platform (administrators and staff)

For `super_admin`, `admin` and `developer` roles. Full details in the
[Admin Guide](ADMIN_GUIDE.md).

## 3.1 Signing in as staff

Staff use a **separate door**: `/admin-login` (also `/staff-portal`). This is
deliberate: the member login at `/login` offers Google sign-in, while the staff
portal does **not** — so a staff account can never be created, promoted or
authenticated through a third-party identity provider. Your staff role is
assigned by another administrator; there is no self-signup.

## 3.2 What changes for staff

| Difference | Detail |
| --- | --- |
| **User Management** appears in the sidebar | Replaces "My Profile" |
| **Activity Feed** gets its own page | `/dashboard/activity` |
| **Overview becomes a staff overview** | System health, user directory, audit trail |
| **Team ownership** | Staff can manage *any* team, not only teams they created |
| **Admin API** | User, role, password, status and broadcast endpoints unlock |

Role differences are narrow but important:

| Capability | `super_admin` | `admin` | `developer` |
| --- | --- | --- | --- |
| View all users | Yes | Yes | Yes |
| Change roles | Yes | Yes | Yes |
| Reset passwords | Yes | Yes | Yes |
| Suspend / re-activate | Yes | Yes | Yes |
| Broadcast notifications | Yes | Yes | Yes |
| **Permanently delete a user** | **Yes** | No | No |

Deletion is irreversible — prefer **Suspend**, which preserves history.

## 3.3 The staff overview

`/dashboard` for staff shows:

- **System health** — live check of the API and its database connection
- **User directory** — accounts in the workspace
- **Audit trail** — recent administrative actions

The health panel is the first thing to look at when something is broken. If it
reports the database as disconnected, no user action will fix it — see
[Part 5.3](#53-the-database-is-asleep-the-1-most-common-problem).

## 3.4 User management (`/dashboard/users`)

**Finding an account:** search by name or email; filter by role and status.

**Changing a role:** row menu → **Change role**. Rules:

- You cannot give anyone a role stronger than your own.
- You cannot change your own role — ask another administrator, so an account
  cannot lock itself out.
- Grant staff roles sparingly. Every extra administrator is extra access to
  every user's data.

**Resetting a password:** row menu → **Reset Password**. Either set a specific
password (validated to 8–72 characters) or generate one automatically (shown
once — copy it immediately). The action is written to the **audit log**, and
the user is notified by email if SMTP is configured. Reset one when a user is
locked out or reports a suspected compromise.

**Suspending:** row menu → **Suspend**. A suspended account cannot sign in by
any method (including Google), keeps all its data, and shows as suspended
wherever it appears. Re-activation restores access instantly. Use this instead
of deletion — it is reversible and keeps the audit trail.

## 3.5 Broadcast notifications

Send one message to everyone in the workspace — maintenance windows, releases,
policy changes. From **User Management → Broadcast**. Keep broadcasts rare; a
stream of notifications trains people to ignore them.

## 3.6 Lead Inbox (`/dashboard/leads`)

The public **Contact** form and **Waitlist** write rows to the database, and
staff read them here.

**Contact Inbox tab** — every inquiry: name, email, subject, message, time
arrived. Unread inquiries are highlighted. Move one through
**Unread → Read → Replied**, which tracks whether you actually answered rather
than whether you read it. Counters show total, unread, and replied.

**Waitlist tab** — signups in real queue order (`queue_position`), each with
its referral code. Change status between **Pending / Invited / Active**
(Pending when they join, Invited when you contact them, Active once they use
the product).

**Export to CSV** downloads the same rows and opens cleanly in Excel — commas,
quotes and accented names are escaped correctly. Use it for outreach such as
mailing every Pending signup.

## 3.7 Changelog Manager (`/dashboard/changelog-admin`)

Publishes the entries shown on the public **Changelog** page. It writes straight
to the same table the public page reads, newest first, so an entry is live the
moment you save it.

- **Version tag** (e.g. `v1.4.0`) must be unique — duplicates are refused with
  a clear message.
- **Release date** is required — it decides the ordering.
- **Badge and colour** — the "New" / "Improved" / "Fixed" pill on the card.
- **Title, description, and bullets** (one per line) become the entry.
- Optional: highlight title/description, category tag, banner title, footnote.
- **Editing and deleting** — deleting is immediate on the public page (with
  confirmation); the version tag is the entry's identity and cannot change.

Keep entries factual and dated — the changelog is the public record of what
shipped.

## 3.8 Admin responsibilities (the part that is actually your job)

### Rotate secrets when they are exposed

| Secret | Where it lives | If it leaks |
| --- | --- | --- |
| Database password | Vercel backend + `server/.env` | Full data access. Reset at the provider, update Vercel, redeploy. |
| `JWT_SECRET` | Vercel backend + `server/.env` | Anyone can forge a session for any user. Regenerate, update, redeploy. **Everyone is signed out** — that is expected. |
| Cloudinary API secret | Vercel backend + `server/.env` | Media can be read or deleted. Regenerate in Cloudinary. |
| SMTP app password | Vercel backend + `server/.env` | Attackers can send email as you. Revoke in Google Account → App passwords. |

**Never paste a secret into chat, a ticket, or a commit.** If a secret has ever
been in public git history, rotating it is mandatory — deleting the file does
not remove it from history.

### Keep the database awake

The database runs on a free tier that powers itself off when idle. **Before a
demonstration, power it on and confirm the health endpoint reports
`"database":"CONNECTED"`** — see Part 5.3.

---

# Part 4 — Building and deploying (developers)

For engineers joining the project. The
[Developer Guide](DEVELOPER_GUIDE.md) is the full reference (23 KB, including
the complete API table); this part gives you the working knowledge to stand up
and understand the system.

## 4.1 What you are working with

| Layer | Technology |
| --- | --- |
| Frontend | React + Vite app (`src/`) |
| Backend | Node.js + Express (`server/`) |
| Database | MySQL (hosted on Aiven's free tier in production) |
| Auth | Password (bcrypt) + Google OAuth + email OTP signup + JWT sessions |
| Email | Nodemailer via SMTP (Gmail app password in production) |
| Media | Cloudinary |
| Hosting | Vercel for both frontend and backend |
| Tests | Node built-in test runner, isolated test database |

## 4.2 Getting it running locally

Prerequisites: Node.js (modern LTS). The stack runs two processes:
`npm run dev` from the project root starts both together.

**Backend** (`server/`): copy `server/.env.example` to `server/.env` and fill
it from the [env table](#43-environment-variables). SQL files in
`server/db/` build the schema.

**Frontend** (`src/`): `.env` with `VITE_API_URL` pointing at your local
backend, e.g. `http://localhost:5000/api/v1`.

## 4.3 Environment variables

`server/.env`:

| Variable | Required | Notes |
| --- | --- | --- |
| `PORT` | yes | `5000` locally |
| `CLIENT_ORIGIN` | yes | Comma-separated allowed origins, for CORS |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | yes | MySQL connection |
| `DB_SSL` | production | `true` for hosted providers (Aiven, RDS) |
| `DB_CONNECTION_LIMIT` | production | `5` — free tiers cap total connections |
| `DB_SQL_MODE` | production | Pins a session SQL mode so strict hosts behave like dev |
| `JWT_SECRET` | **yes** | Long random string. Never the dev fallback in production |
| `JWT_EXPIRES_IN` | yes | e.g. `7d` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | optional | OTP email; unset = codes logged to console |
| `SMTP_WAIT_MS` | optional | Bound on SMTP latency; email sends in the background |
| `GOOGLE_CLIENT_ID` | optional | Enables Google sign-in |
| `FRONTEND_URL` | production | For reset-password links and CORS |

Frontend `.env`: `VITE_API_URL` (see above).

## 4.4 Database and migrations

- Schema is built from SQL files in `server/db/` (idempotent).
- Production cloud DB uses SSL with a connection limit of 5 — keep long-lived
  pools small.
- The free tier powers off when idle; the API reports this via `/health`
  (`database: CONNECTED` / `DISCONNECTED`).

## 4.5 Authentication and authorisation — the part to get right

Authentication and authorization are strictly one-way:

- **New accounts are always created as `member`.** Staff roles are
  unreachable through any self-service path, including Google sign-in. Google
  can never authenticate, create, or promote a staff account.
- `authorizeRoles(...)` is applied **per route** on the server — hiding a
  button in the UI is never the enforcement point.
- Priority ordering: `super_admin` > `admin` > `developer` > `member` >
  `viewer`. Certain admin actions (delete user) are `super_admin` only.
- A known historical bug and its fix are documented in the Developer Guide —
  this table is the security-sensitive code so treat it with care.

## 4.6 Testing

`npm test` runs **112 tests across 7 suites** against an isolated
`suprema_test` database (never the production one):

- smoke, password-reset, authorization, changelog, leads, google-signin,
  security
- Test environment stubs SMTP (no real email is sent) and skips rate limiting.
- Run tests locally with `NODE_ENV=test`; the server never binds a port in test
  mode.

Add coverage where behaviour changes — especially for anything touching routes,
roles, or the auth model.

## 4.7 Security model (summary)

- Hardened response headers; a single error handler that never leaks stack
  traces or internals to clients.
- Rate limiting on auth endpoints in production.
- All queries parameterised; no hardcoded secrets in the repo (38 server files
  audited).
- Verification: Google sign-in refuses unverified emails, OTP codes expire,
  reset links are single-use with a 30-minute window.

## 4.8 Deployment (Vercel)

- **Backend** and **frontend** are separate Vercel projects. Production URLs in
  [0.5](#05-where-the-live-system-lives).
- Set every production env var in the Vercel project settings, then redeploy.
- After any deploy, verify with the health check and a real login.

---

# Part 5 — Troubleshooting and FAQ

## 5.1 Member troubleshooting

| Problem | What to do |
| --- | --- |
| "Something went wrong on our end" | The server had a problem. Try again; if it persists the database may be asleep — tell an administrator. |
| Verification code never arrives | Check spam, wait a minute, request a new code. |
| Google says "Access blocked" | Your email is not on the app's test-user list. Ask an administrator. |
| A sidebar item is missing | It is role-based. Members see "My Profile"; staff see "User Management". |
| I cannot edit a team | Only its owner, workspace admins and staff can — ask an administrator. |
| Page is blank after clicking a link | Refresh once — the app needs a hard refresh after a new deploy. |
| Sign-in says account suspended | An administrator suspended it — contact them. |

## 5.2 Admin troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| All logins fail, health shows `DISCONNECTED` | Database asleep | See 5.3 |
| Google sign-in: *"not configured on this server"* | `GOOGLE_CLIENT_ID` missing | Add it in Vercel, redeploy |
| Google sign-in: *"invalid client"* | Wrong client ID (truncated paste) | Re-copy it from Google Cloud, redeploy |
| I cannot see User Management | You are not staff | Sign in at `/admin-login` |
| I cannot delete a user | Only `super_admin` may | Use Suspend, or ask a super admin |
| Reset password says no email was sent | SMTP not configured/failing | Use the generated password; deliver it securely |
| I cannot change my own role | Self-lockout protection | Ask another administrator |

## 5.3 The database is asleep (the #1 most common problem)

**Symptom.** Every sign-in fails and data pages show *"Something went wrong on
our end. Please try again."* The health endpoint reports
`"database":"DISCONNECTED"`.

**Why.** The hosting provider powers free-tier databases off after a period of
inactivity. The data is completely safe — the service is asleep, not deleted.
While it sleeps its hostname disappears from DNS, so the API cannot connect.

**Fix.**

1. Open the database provider's console.
2. Power the service **on** if it shows `POWER_OFF`.
3. Wait until state reads `RUNNING` — usually one to two minutes.
4. Request `.../api/v1/health` again and confirm `"database":"CONNECTED"`.

Users do not need to do anything; access resumes on its own.

**Prevent.** Before any demonstration, check the health endpoint first.

## 5.4 Escalation path (for staff)

1. Check the **System health** panel.
2. Check the **Activity Feed** for a recent change that explains it.
3. If the database is down, power it on — most common cause by far.
4. If it persists, capture the failing URL, the time, and the exact message,
   then escalate to the developer who maintains the deployment.

---

# FAQ

**Q: Is Google sign-in safe for admin accounts?**
Yes — staff accounts cannot be created or authenticated through Google at all.
Google sign-in always produces a `member`, never a staff role.

**Q: I forgot my password. Does an admin have to fix it?**
No. Use **Forgot your password?** on the sign-in page — the reset link is
single-use and expires after 30 minutes.

**Q: Why can't I see the same sidebar items as my colleague?**
Items are role-based. Members see "My Profile"; staff see "User Management".
Also remember you may be viewing a different workspace.

**Q: Is my data safe if the database is asleep?**
Yes. The data is intact — the service simply powered off. Powering it on
restores everything.

**Q: Can I recover a permanently deleted user?**
No. Deletion is irreversible by design (only `super_admin` can do it). Use
**Suspend** to preserve history.

**Q: Why does the changelog not show my new entry?**
It is written live to the public table on save. If it is missing, check the
entry's **release date** — that decides ordering, and a missing date sorts it
to the bottom.

**Q: How do I test the app without affecting real users?**
GitHub Actions / local tests use an isolated `suprema_test` database. Never run
the test suite against production data.

---

# Glossary

| Term | Meaning |
| --- | --- |
| **Workspace** | A sealed team space containing projects, tasks, teams and members |
| **Workspace role** | Your permission inside one workspace: `owner`, `admin`, `member`, `guest` |
| **Platform role** | Who you are across all of Suprema: `super_admin`, `admin`, `developer`, `member`, `viewer` |
| **Project** | A group of related work, with a status (Planning…Archived) |
| **Task** | One piece of work: title, assignee, priority, deadline, stage |
| **Stage** | `To Do → In Progress → In Review → Done` |
| **Kanban / List** | Board view (columns by stage) / table view (scan + bulk edit) |
| **OTP** | One-time 6-digit code emailed to verify account creation |
| **JWT** | The signed session token; rotating `JWT_SECRET` signs everyone out |
| **Audit trail / Activity feed** | The timestamped record of who changed what |
| **Lead** | A Contact-form inquiry or Waitlist signup captured on the public site |

---

# Quick reference card

- **Frontend:** `https://superma-task-management.vercel.app`
- **Backend API:** `https://superma-task-management-37zl.vercel.app/api/v1`
- **Health check:** `.../api/v1/health` → must say `"database":"CONNECTED"`
- **Entry points:** `/` (public) · `/login` (members) · `/admin-login` (staff)
- **Task stages:** `To Do → In Progress → In Review → Done`
- **Priorities:** `Urgent · High · Medium · Low`
- **Search:** `Ctrl + K` / `⌘ + K` anywhere in the dashboard
- **Demo accounts:** seeded at `@suprema.io` (all roles). Passwords are *not*
  written in the repository — request them from the project team, and change
  them before demonstrating publicly.

---

*This guide is maintained with the codebase. If behaviour changes, update this
document in the same change. Never write a real secret or password into these
files.*