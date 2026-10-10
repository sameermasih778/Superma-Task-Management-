# Suprema — User Guide

For members and viewers. No technical knowledge needed.

---

## 1. What you can do with Suprema

Suprema is where your team tracks work from start to finish. Everything you need
is inside your **workspace**:

- **Projects** group related work (for example, "Mobile App Launch").
- **Tasks** are the individual pieces of work, each with an owner, a priority
  and a deadline.
- **Teams** group the people working together.
- **Calendar, Analytics and Activity** show where work stands right now.

---

## 2. Creating an account

Go to the site and click **Sign In → Create account**.

1. Enter your **name**, **email address** and a **password**.
2. Suprema emails you a **6-digit verification code**. It is valid for 10 minutes.
3. Enter the code to finish. Your account is created and you are signed in.

> **No code arrived?** Check your spam folder first. Codes can take a few seconds
> to arrive. You can request a new one after a minute.

### Signing in with Google

On the sign-in page, click **Continue with Google**. A Google window opens —
choose your account and you are signed in immediately.

- Your account is created automatically as a **member** on first use.
- If your email already exists, you keep the role you already had.
- Staff accounts can only be created by an administrator, so Google sign-in will
  never make you an administrator.

---

## 3. Signing in and out

| Step | Action |
| --- | --- |
| Members and viewers | `/login` |
| Staff | `/admin-login` |
| Leave | Click **Sign Out** in the top bar |

You stay signed in across visits. If you were ever signed out unexpectedly,
it is usually because the account was suspended or the password was reset by an
administrator.

---

## 4. The dashboard at a glance

The left sidebar is your navigation. Some items appear only for certain roles.

| Sidebar item | What it is for |
| --- | --- |
| **Overview** | Your landing page: your task queue and the projects you contribute to |
| **Projects** | Every project in the workspace, with progress |
| **Tasks Board** | All tasks — switch between Kanban and List |
| **Calendar** | Tasks plotted on their due dates |
| **Analytics** | Completion rate, hours, overdue work, and workload per person |
| **Teams** | The teams in this workspace and their members |
| **Activity Feed** | A chronological log of what happened |
| **My Profile** | Your name, email, avatar and password (members and viewers) |
| **User Management** | Staff only — see the Admin Guide |

### Switching workspaces

Your workspace name sits at the top of the sidebar. Click it to open the list and
switch. Everything you see — projects, tasks, teams — belongs to the workspace
you currently have selected.

---

## 5. Projects

### Creating a project

1. Go to **Projects → New Project**.
2. Give it a **name** and a short **description**.
3. Set a **status**:

| Status | Meaning |
| --- | --- |
| Planning | Still being discussed |
| Active | Work is happening now |
| On hold | Paused deliberately |
| Completed | Finished |
| Archived | Closed and kept for the record |

### Using a project

Open it to see its tasks. Use a project for one outcome — "Q1 Website Redesign"
— rather than a department. Small, focused projects make the Analytics numbers
meaningful.

---

## 6. Tasks — the core of the platform

### Creating a task

From **Tasks Board → New Task**, or from inside a project.

Give each task:

- a **title** that says what "done" looks like
- an **assignee** (who is responsible)
- a **priority**
- a **deadline** (optional, but strongly recommended)
- optionally, which **project** it belongs to

### The four stages

Move a task by dragging it, or from the task drawer:

`To Do → In Progress → In Review → Done`

### Priorities

| Priority | Use it for |
| --- | --- |
| Urgent | Blocking someone or a deadline is now |
| High | Needed this week |
| Medium | The default — normal work |
| Low | Nice to have |

### Two views

**Kanban** — columns per stage. Best for seeing flow at a glance and dragging
cards between stages.

**List** — a table with subtask counts, inline status and priority controls,
assignee avatars and deadline warnings. Best for scanning and bulk editing.

Use **Kanban** when you are deciding what to work on next. Use **List** when you
are checking status or deadlines.

### Filtering

The filter bar narrows the board by **assignee**, **deadline** (overdue, due
today, this week, none), **priority**, and a text search of titles and
descriptions. Filters combine. **Reset** clears everything at once.

### Opening a task

Click any task to open its drawer — a panel with everything about that task:

| Tab | Contents |
| --- | --- |
| **Subtasks** | Break the task into smaller steps |
| **Comments** | Discuss it with the team |
| **Attachments** | Upload files (images, documents) |

The drawer also lets you change **status**, **priority**, **assignee** and
**deadline** without leaving the task.

### Time tracking

If a task has an estimated hour budget, log the time you actually spent using
the quick buttons (**+0.5h, +1h, +2h**) or type an exact value. The tracker shows
progress against the estimate and warns you when you go **over estimate**. Every
change is recorded in the activity log.

---

## 7. Calendar

`/dashboard/calendar` shows a month grid with your tasks on their due dates.
Today is highlighted; days from the previous and next month are dimmed.

- Colour-coded badges show priority; completed tasks are struck through.
- Use **Previous Month / Next Month / Today** to move around.
- Filter by project to answer "what is due for *this* project?"
- Click any task to open its drawer and update it in place.

**Efficient use:** glance at the calendar at the start of each week. Anything
red or overdue is what you should deal with first.

---

## 8. Analytics

`/dashboard/analytics` answers "how is the team actually doing?"

| Card | Reads as |
| --- | --- |
| Completion rate | What share of work is finished |
| Hours logged vs estimated | Are we over or under budget |
| In progress / in review | What is moving right now |
| Overdue tasks | What has slipped |

Below that: the status breakdown, the priority mix, and a **per-member workload
table** — useful for spotting who is overloaded or underused.

---

## 9. Teams

`/dashboard/teams` lists the workspace's teams and who belongs to each.

- **Staff and workspace admins** can create a team, add or remove members, and
  delete a team they own.
- **Members** can see teams and manage the ones they created.

If you cannot see an action on a team, you are not its owner and you are not an
administrator. Ask an administrator to do it or to make you a team leader.

---

## 10. Activity Feed

A running, timestamped record of what happened in the workspace — tasks created,
status changes, comments, membership changes. It answers "when did this change,
and who changed it?" without hunting through email.

Administrators and developers can open it from the sidebar as its own page.

---

## 11. Finding anything fast

Press **Ctrl + K** (or **⌘ + K** on a Mac) anywhere in the dashboard to open
**Global Search**. Type to search across **projects**, **tasks** and **teams**,
then use the arrow keys and Enter to jump straight to a result.

This is the fastest way to reach anything — faster than clicking through the
sidebar.

---

## 12. Notifications

The bell icon shows notifications for work assigned to you, mentions, system
events and administrator announcements. Read notifications can be marked read
individually or all at once. Administrators can broadcast a message to everyone
in the workspace.

---

## 13. Your profile

**My Profile** lets you:

- change your display name
- upload or remove a profile picture (a letter avatar appears if you do not add
  one)
- change your password
- see which workspaces you belong to and your role in each

---

## 14. Working efficiently — the short version

1. **Start in the week view.** Calendar first, then the board.
2. **Filter before you decide.** "Mine + Overdue" answers "what should I do today?"
3. **One click, not five.** `Ctrl + K` beats navigating menus.
4. **Write titles as outcomes.** "Checkout fails on Safari" beats "Fix checkout".
5. **Always set a deadline.** Undated tasks quietly become overdue work.
6. **Log time as you go,** not at the end of the week.
7. **Use subtasks for anything over a day.** It makes progress visible.
8. **Check Analytics before a status meeting.** It is already written for you.

---

## 15. Troubleshooting

| Problem | What to do |
| --- | --- |
| "Something went wrong on our end" | The server had a problem. Try again; if it persists the database may be asleep — tell an administrator. |
| Verification code never arrives | Check spam, wait a minute, request a new code. |
| Google says "Access blocked" | Your email is not on the app's test-user list. Ask an administrator. |
| A sidebar item is missing | It is role-based. Members see "My Profile"; staff see "User Management". |
| I cannot edit a team | Only its owner, workspace admins and staff can. |
| Page is blank after clicking a link | Refresh once — the app needs a hard refresh after a new deploy. |
| Sign-in says account suspended | An administrator suspended it. Contact them. |

Still stuck? Send the details through the **Contact** page on the marketing site,
including what you clicked and what appeared.