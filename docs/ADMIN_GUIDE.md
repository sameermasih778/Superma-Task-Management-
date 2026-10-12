# Suprema â€” Admin Guide

For `super_admin`, `admin` and `developer` staff.

---

## 1. Signing in as staff

Staff use a **separate door**: `/admin-login` (also reachable at
`/staff-portal`).

This is deliberate. The member login at `/login` is for everyday users and offers
Google sign-in; the staff portal does not, so a staff account can never be
created, promoted or authenticated through a third-party identity provider.

Your staff role is assigned by another administrator. There is no self-signup for
staff.

---

## 2. What changes for staff

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

Deletion is irreversible and removes the account and its links. Only
`super_admin` can do it, and only when removal is genuinely required â€”
prefer **Suspend**, which preserves history.

---

## 3. The staff overview

`/dashboard` for staff shows:

- **System health** â€” live check of the API and its database connection
- **User directory** â€” accounts in the workspace
- **Audit trail** â€” recent administrative actions

The health panel is the first thing to look at when something is broken. If it
reports the database as disconnected, no user action will fix it â€” see
[section 9](#9-when-the-database-is-asleep).

---

## 4. User management

Go to **User Management** (`/dashboard/users`).

### Finding an account

Use the search box to filter by name or email. Filters also narrow by role and
by account status.

### Changing a role

Open the row menu â†’ **Change role**, then pick the new role.

Rules worth knowing:

- You cannot give anyone a role stronger than your own.
- You cannot change your own role â€” ask another administrator, so an account
  cannot accidentally lock itself out.
- Grant staff roles (`admin`, `developer`, `super_admin`) sparingly. Every extra
  administrator is extra access to every user's data.

### Resetting a password

Open the row menu â†’ **Reset Password**. You can either:

- **Set a specific password** â€” type it and confirm. It is validated against the
  same rules as any user password (8â€“72 characters, since that is what bcrypt
  accepts).
- **Generate one automatically** â€” a cryptographically random password is
  produced and shown once. Copy it immediately; it cannot be displayed again.

Either way:

- The action is written to the **audit log**.
- The user is notified by email if SMTP is configured. If email is unavailable,
  the app says so honestly rather than claiming a message was sent â€” in that case
  pass the password to the user through a secure channel.

Reset a password when a user is locked out or has reported a suspected compromise.

### Suspending and re-activating

Open the row menu â†’ **Suspend**. A suspended account:

- cannot sign in by any method, including Google
- keeps all of its data
- shows as suspended wherever it appears

Re-activation restores full access immediately. Use this instead of deletion â€”
it is reversible and keeps the audit trail intact.

---

## 5. Broadcast notifications

Send one message to everyone in the workspace â€” for maintenance windows,
releases or policy changes. From **User Management â†’ Broadcast**.

Keep broadcasts rare. A stream of notifications trains people to ignore them.

---

## 6. Lead Inbox

The public **Contact** form and **Waitlist** write rows to the database, and
`/dashboard/leads` is where staff read them.

**Contact Inbox tab**
- Every website inquiry: name, email, subject, message and when it arrived
- Unread inquiries are highlighted
- Move one through **Unread â†’ Read â†’ Replied** â€” this tracks whether you
  actually answered, not whether you read it
- Counters for total, unread and replied

**Waitlist tab**
- Signups in **real queue order**, using the stored `queue_position`
- Each row shows the referral code issued to that person
- Change status between **Pending**, **Invited** and **Active** â€” typically
  Pending when they join, Invited when you contact them, Active once they are
  using the product

**Export to CSV** on either tab downloads the same rows. Use it for outreach â€”
for example, mailing every Pending signup. The file opens cleanly in Excel:
values containing commas or quotes are escaped correctly, and accented names
survive.

> Leads are platform-wide rather than tied to a workspace, so status changes are
> not written to the workspace activity feed. If you need an audit trail of who
> changed a lead's status, ask a developer to add one.

---

## 7. Teams and ownership

Staff can manage **any** team in the workspace, regardless of who created it:

- create teams
- add or remove members
- delete a team

Regular members can only manage the teams they created. This rule is enforced on
the server, not just hidden in the interface â€” so it holds even if someone
forges a request.

---

## 8. Your responsibilities as an administrator

Technical, but genuinely part of the job.

### Rotate secrets when they are exposed

| Secret | Where it lives | If it leaks |
| --- | --- | --- |
| Database password | Vercel backend + `server/.env` | Full data access. Reset at the provider, then update Vercel and redeploy. |
| `JWT_SECRET` | Vercel backend + `server/.env` | Anyone can forge a session token for any user. Regenerate, update, redeploy. **Everyone is signed out** â€” that is expected. |
| Cloudinary API secret | Vercel backend + `server/.env` | Media can be read or deleted. Regenerate in Cloudinary; existing uploads keep working. |
| SMTP app password | Vercel backend + `server/.env` | Attackers can send email as you. Revoke in Google Account â†’ App passwords. |

**Never paste a secret into chat, a ticket, or a commit.** If a secret has ever
been in public git history, rotating it is mandatory â€” deleting the file does not
remove it from history.

### Keep the database awake

The database runs on a free tier that powers itself off when idle. Before a
demonstration, power it on and confirm the health endpoint reports
`"database":"CONNECTED"`.

---

## 9. When the database is asleep

**Symptom.** Every sign-in fails and pages that load data show
*"Something went wrong on our end. Please try again."* The health endpoint
reports `"database":"DISCONNECTED"`.

**Why.** The hosting provider powers free-tier databases off after a period of
inactivity. The data is completely safe â€” the service is asleep, not deleted.
While it sleeps its hostname disappears from DNS, so the API cannot connect.

**Fix.**

1. Open the database provider's console.
2. Power the service **on** if it shows `POWER_OFF`.
3. Wait until the state reads `RUNNING` â€” usually one to two minutes.
4. Request `.../api/v1/health` again and confirm `"database":"CONNECTED"`.

Users do not need to do anything; access resumes on its own.

---

## 10. Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| All logins fail, health shows `DISCONNECTED` | Database asleep | See section 9 |
| Google sign-in returns *"not configured on this server"* | `GOOGLE_CLIENT_ID` missing from the backend project | Add it in Vercel, then redeploy |
| Google sign-in returns *"invalid client"* | Wrong client ID (a truncated paste) | Re-copy it and redeploy |
| I cannot see User Management | You are not staff | Sign in at `/admin-login` |
| I cannot delete a user | Only `super_admin` may | Use Suspend, or ask a super admin |
| Reset password says no email was sent | SMTP not configured or failing | Use the generated password and deliver it securely |
| I cannot change my own role | Self-lockout protection | Ask another administrator |

---

## 11. Escalation path

1. Check the **System health** panel.
2. Check the **Activity Feed** for a recent change that explains it.
3. If the database is down, power it on â€” it is the most common cause by far.
4. If it persists, capture the failing URL, the time, and the exact message, then
   escalate to the developer who maintains the deployment.