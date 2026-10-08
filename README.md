# Suprema

A task and project management SaaS platform — built as **KhawajaLabs Project 2**.

Suprema is two things in one codebase:

- a **public marketing site** (landing page, pricing, blog, changelog, waitlist) built to sell the product
- a **real, working SaaS application** behind login — workspaces, teams, projects, a drag-and-drop Kanban board, comments, attachments, notifications, and an admin panel for managing users

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Default Credentials](#default-credentials)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Roles & Permissions](#roles--permissions)
- [API Reference](#api-reference)
- [Database](#database)
- [Migrations](#migrations)
- [Environment Variables](#environment-variables)
- [Notes & Known Behaviours](#notes--known-behaviours)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | TailwindCSS 3, Framer Motion, Lucide React |
| Backend | Node.js, Express 4, Nodemon |
| Database | MySQL 8 (`mysql2` connection pool) |
| Auth | JWT, bcrypt |
| Security | Helmet, CORS, express-rate-limit, express-validator, RBAC middleware |
| Other | Multer (uploads), Nodemailer (OTP email) |
| Linting | Oxlint |

---

## Quick Start

### Prerequisites

- **Node.js `^20.19.0` or `>=22.12.0`** (required by Vite 8)
- **MySQL** running locally (XAMPP / WAMP / MySQL Server)

### 1. Install dependencies

```bash
# root - installs client deps
npm install

# server - installs its own deps
cd server && npm install && cd ..
```

### 2. Configure environment variables

```bash
# root
cp .env.example .env          # Windows: copy .env.example .env

# server
cd server && cp .env.example .env && cd ..
```

At minimum, set your MySQL password and a real JWT secret in `server/.env`:

```env
DB_PASSWORD=your_mysql_password_here
JWT_SECRET=change_this_to_a_long_random_string
```

### 3. Create and seed the database

```bash
npm run db:init
```

This **drops and recreates** `suprema_db`, then runs `schema.sql` and `seed.sql`. It is only needed once, on a fresh setup.

> **⚠️ This deletes every account.** It runs `DROP DATABASE`, so any user who registered through the UI is permanently removed. Running it as part of your normal startup is the single most common cause of "my account disappeared and can't log in" — and the admin panel will not list the user either, because the row genuinely no longer exists.
>
> `db:init` now refuses to run when the database already contains users, and tells you to use `npm run dev` instead. If you genuinely want a clean slate, ask for it explicitly:
>
> ```bash
> npm run db:reset        # destructive, on purpose
> ```
>
> To just restart the app afterwards, you only need `npm run dev` — the schema migrates itself on boot.

### 4. Run both servers

```bash
npm run dev
```

- Client → <http://localhost:5173>
- API → <http://localhost:5000>

Or run them separately with `npm run dev:client` and `npm run dev:server`.

---

## Default Credentials

Seeded by `npm run db:init`. 

| Role | Email | Portal |
| --- | --- | --- |
| Super Admin | `admin@suprema.io` | `/admin-login` |
| Admin | `sarah@suprema.io` | `/admin-login` |
| Developer | `developer@suprema.io` | `/admin-login` |
| Member | `alex@suprema.io` | `/login` |
| Viewer | `client@suprema.io` | `/login` |

> These are development credentials committed to the repository. Rotate them before any deployment.

### The two login portals

Suprema splits authentication deliberately:

- **`/login`** — public site. Members and viewers sign in here. They see the marketing navbar on dashboard pages.
- **`/admin-login`** (alias `/staff-portal`) — internal staff portal. Admins, developers, and super admins sign in here. The public navbar is **not** rendered on dashboard pages for these accounts, giving a dedicated staff dashboard.

Logging out returns you to whichever portal matches your account.

---

## Available Scripts

Run from the **root** directory:

| Script | Description |
| --- | --- |
| `npm run dev` | Start client and server together |
| `npm run dev:client` | Start only the Vite dev server |
| `npm run dev:server` | Start only the Express API (nodemon) |
| `npm run start:server` | Start the API without nodemon |
| `npm run db:init` | Create and seed the database. **Refuses to run if the database already has users** |
| `npm run db:reset` | Deliberately drop, recreate, and seed — **destroys all registered accounts** |
| `npm run db:migrate` | Apply pending additive schema migrations (safe) |
| `npm run build` | Production build of the client into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

---

## Project Structure

```
.
├── src/                        # React client
│   ├── components/             # Shared UI
│   │   └── dashboard/          # Layout, sidebar, modals, drawers
│   ├── context/AuthContext.jsx # Auth state, session persistence
│   ├── data/                   # Static blog + changelog content
│   ├── pages/                  # Route components
│   ├── utils/api.js            # Fetch wrapper (injects JWT)
│   └── App.jsx                 # Router and layout
│
├── server/                     # Express API
│   ├── config/db.js            # MySQL pool + startup migration guard
│   ├── controllers/            # Request handlers
│   ├── database/
│   │   ├── schema.sql          # Source of truth for a fresh DB
│   │   ├── seed.sql            # Demo data
│   │   └── migrate.js          # Additive, idempotent migrations
│   ├── middleware/             # auth, RBAC, validation, uploads, errors
│   ├── routes/                 # Express routers
│   ├── scripts/                # initDb.js, migrate.js
│   ├── uploads/                # Multer file storage
│   └── server.js
│
└── FullStack_SRS_Suprema.docx  # Software Requirements Specification
```

---

## Roles & Permissions

Roles live in the `users.role` column and drive both the UI and the API via `authorizeRoles`.

| Role | Capabilities |
| --- | --- |
| `super_admin` | Everything, including deleting user accounts |
| `admin` | Manage users, roles, passwords, status, broadcasts |
| `developer` | Same as `admin` |
| `member` | Standard workspace user |
| `viewer` | Read-only |

### Admin panel (`/dashboard/users`)

Visible to `super_admin`, `admin`, and `developer`. Supports:

- listing all users with role, status, workspace count, and join date
- changing roles
- resetting a password (a temporary one is emailed, or printed to the server console without SMTP)
- **suspending / reactivating** an account
- broadcasting an announcement to everyone, or to a specific user
- deleting a user — **super_admin only**

### Profile pictures

**Staff accounts (`super_admin`, `admin`, `developer`) use a fixed role emblem** and cannot upload a photo. The emblem is chosen by the *system* role, so a developer who merely owns a workspace is still treated as staff. It also makes it obvious at a glance which portal someone is in. Their sidebar shows no **My Profile** link, and `/dashboard/profile` is blocked for them by `MemberRoute.jsx`.

**Members and viewers** get a neutral placeholder badge until they upload something. Upload is at **Dashboard → My Profile**, or by clicking your own name in the sidebar footer.

| | |
| --- | --- |
| Formats | PNG, JPEG, GIF, WEBP |
| Max size | 2MB |
| Endpoints | `POST /auth/avatar` (multipart, field `avatar`), `DELETE /auth/avatar` |

`src/utils/avatar.js` exposes `getAvatarUrl(user)`, `getAvatarFor(person, roleKey)`, `isStaffRole(role)` and `canUploadAvatar(role)`. Every avatar in the app goes through it, so the emblem-vs-photo decision is made in exactly one place.

All four badges are local SVGs in `src/assets/` — there is no third-party avatar API, so avatars render identically offline and cannot leak account information to an external service.

The staff restriction is enforced **server-side** in `authController.js` — hiding the upload controls in the UI is only a convenience, and a direct API call would otherwise still succeed.

| | |
| --- | --- |
| Formats | PNG, JPEG, GIF, WEBP |
| Max size | 2MB |
| Endpoints | `POST /auth/avatar` (multipart, field `avatar`), `DELETE /auth/avatar` |

Validation happens in three layers, because the first two are attacker-controlled:

1. declared MIME type — client supplied, trivially forged
2. file extension — must match that MIME type
3. **magic bytes** — the real leading bytes of the file on disk are compared against the signature for the claimed format, which is what catches an HTML or SVG payload renamed to `.png`

Files are ignored by git. Note that local-disk storage will not survive an ephemeral host such as Vercel — use object storage (S3/Cloudinary) for a real deployment.

### Toasts

Action feedback uses a shared toast system (`src/components/toast/`), available anywhere via `useToast()`:

```js
const toast = useToast();
toast.success('Role updated to "developer"');
toast.error(err.message);
toast.info('Workspace switched');
toast.warning('This cannot be undone');
```

Toasts and the bell dropdown are deliberately different: a **toast** is immediate, transient feedback about an action just taken, while the **bell** is a durable inbox of messages still waiting to be read. Replacing one with the other would silently lose messages the user never saw.

### Dashboards

Each role gets a genuinely different dashboard, all composed from the shared primitives in `src/components/dashboard/DashboardShell.jsx` so they still read as one product. Routing is driven purely by the role on the JWT, never by client state.

| Role | Dashboard | Accent | Answers |
| --- | --- | --- | --- |
| `member` / `viewer` | `MemberDashboard.jsx` | indigo | "What is mine?" — my queue, overdue, my projects |
| `developer` | `DeveloperDashboard.jsx` | emerald | "What is the board doing?" — pipeline, throughput, workload |
| `admin` / `super_admin` | `AdminDashboard.jsx` | amber | "Is the platform healthy?" — health, users, audit trail |

Accents are defined once in `src/components/dashboard/accents.js` and applied as CSS custom properties, so a role's entire palette can be re-themed from one file. Shared data loading lives in `src/hooks/useDashboardData.js`.

The admin dashboard's **System health** panel reads `GET /health`, which performs a live `SELECT 1` — it reports real `CONNECTED` / `DISCONNECTED` state plus actual uptime and environment rather than a hardcoded string.

### The "New Task" button

The header's **New Task** button works from every dashboard page, not just the Tasks Board. The modal is rendered by `DashboardLayout` (not by `TasksPage`), because it used to exist only on the board — so clicking the button from Overview set state that nothing was listening to and appeared to do nothing.

- Opened from the **header** → no project in context, so the modal shows a **Project** selector.
- Opened from a **task row** → the project is pre-selected and the selector is hidden.
- **Edit** opens the same modal pre-filled, driven by `editingTask` state lifted into `DashboardLayout` and shared through outlet context.

### Guards

Several rules are enforced server-side, so they hold even if someone bypasses the UI:

- you cannot change your **own** role, status, or delete your own account
- only a **super_admin** may grant the `super_admin` role
- only a **super_admin** may suspend another super admin
- a suspended account is **blocked at login** with a 403

The client also has a route guard, but it is a UX convenience only — the API is the real boundary.

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

All routes require `Authorization: Bearer <token>` except registration, login, and the health check.

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/send-otp` | Email a 6-digit verification code |
| `POST` | `/auth/verify-otp` | Verify code and create the account |
| `POST` | `/auth/register` | Register directly (no OTP) |
| `POST` | `/auth/login` | Log in, returns a JWT |
| `GET` | `/auth/me` | Current user + workspaces |
| `POST` | `/auth/avatar` | Upload profile picture (members/viewers only) |
| `DELETE` | `/auth/avatar` | Remove profile picture |

### Workspaces & Teams

| Method | Endpoint | Query |
| --- | --- | --- |
| `GET` | `/workspaces` | — |
| `POST` | `/workspaces` | — |
| `GET` | `/workspaces/:id/members` | — |
| `POST` | `/workspaces/:id/members` | — |
| `GET` | `/teams` | `workspace_id` |
| `POST` | `/teams` | `workspace_id` |
| `GET` | `/teams/:id/members` | — |

### Projects & Tasks

| Method | Endpoint | Query |
| --- | --- | --- |
| `GET` | `/projects` | `workspace_id`, `team_id`, `status` |
| `POST` | `/projects` | — |
| `GET` | `/projects/:id` | — |
| `PUT` | `/projects/:id` | — |
| `GET` | `/tasks` | `project_id` **or** `workspace_id`, plus `status`, `priority`, `assignee_id`, `parent_id` |
| `POST` | `/tasks` | — |
| `PATCH` | `/tasks/:id/status` | — |
| `DELETE` | `/tasks/:id` | — |

> `GET /tasks` accepts **either** `project_id` or `workspace_id`. If both are supplied, `project_id` wins so a project filter is never silently widened.

### Collaboration

| Method | Endpoint | Query |
| --- | --- | --- |
| `GET` | `/comments` | `task_id` |
| `POST` | `/comments` | — |
| `DELETE` | `/comments/:id` | — |
| `GET` | `/attachments` | `task_id` |
| `POST` | `/attachments` | multipart `file` |
| `DELETE` | `/attachments/:id` | — |
| `GET` | `/notifications` | — |
| `PATCH` | `/notifications/:id/read` | — |
| `PATCH` | `/notifications/read-all` | — |
| `GET` | `/activity` | `workspace_id` |

### Admin

| Method | Endpoint | Min. role |
| --- | --- | --- |
| `GET` | `/admin/users` | admin |
| `PATCH` | `/admin/users/:id/role` | admin |
| `PATCH` | `/admin/users/:id/status` | admin |
| `PATCH` | `/admin/users/:id/reset-password` | admin |
| `DELETE` | `/admin/users/:id` | **super_admin** |
| `POST` | `/admin/notifications/broadcast` | admin |

#### Sending notifications

`POST /admin/notifications/broadcast` supports both recipients in one endpoint:

```jsonc
// everyone (omit user_ids, or pass [])
{ "title": "Maintenance tonight", "message": "Downtime 10pm-11pm", "type": "announcement" }

// one or more specific users
{ "title": "Please review", "message": "Task 42 is assigned to you", "type": "task_assigned", "user_ids": [4, 7] }
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | max 200 chars |
| `message` | yes | |
| `type` | no | `info` (default) · `task_assigned` · `mention` · `system` · `announcement` |
| `link` | no | optional deep link |
| `user_ids` | no | array of user IDs. Omit or pass `[]` to notify **everyone** |

Unknown `user_ids` are skipped rather than failing the whole send, and the response reports what was skipped. Rows are inserted in a single transaction, so a partial broadcast is not possible.

### Health

`GET /health` (also mounted at `/api/v1/health`) returns service status.

---

## Database

MySQL, 12 tables:

```
users                 workspaces          workspace_members
teams                 team_members        projects
tasks                 task_comments       task_attachments
activity_logs         notifications       email_verifications
```

Notable constraints:

- `users.email` is unique
- `users.role` is an enum: `super_admin, admin, developer, member, viewer`
- `users.status` is an enum: `active, inactive, suspended`
- `tasks.parent_id` self-references, enabling subtasks

Registering creates a user with role `member` and status `active`, and automatically provisions a personal workspace with that user as `owner`.

---

## Migrations

`server/database/schema.sql` is the source of truth for a **fresh** database. Databases created **before** a schema change keep the old definition, so Suprema ships additive migrations in `server/database/migrate.js`:

| Migration | Purpose |
| --- | --- |
| `001-users-role-enum-includes-developer` | Adds `developer` to the `users.role` enum |
| `002-repair-blank-user-roles` | Resets roles that were silently blanked to `member` |

**These run automatically when the server starts.** You normally do nothing. To apply them without starting the API:

```bash
npm run db:migrate
```

Migrations must stay **idempotent** (safe on every boot) and **non-destructive** (never drop or rewrite valid data).

---

## Environment Variables

### `server/.env`

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=suprema_db

JWT_SECRET=
JWT_EXPIRES_IN=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional - enables real OTP emails. Without these, the OTP is
# printed to the server console instead.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

### `.env` (client)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

> **`JWT_SECRET` has a hardcoded fallback** (`suprema_jwt_super_secret_key_2026_dev_mode`) in the source so local dev works out of the box. This must be set to a real value in any deployed environment, or tokens can be forged.


