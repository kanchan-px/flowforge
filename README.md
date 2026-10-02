# FlowForge

A Jira-inspired project and task management application built with Next.js, React, TypeScript, Prisma, and PostgreSQL. FlowForge gives authenticated users a centralized workspace to create projects, manage tasks, track status and priority, collaborate with invited teammates, and stay on top of activity through notifications.

> **Status:** In active development. Not yet deployed. Core project/task management, authentication, settings, and the collaboration foundation (project members, roles, email invitations) are built and working. See [Roadmap](#roadmap) below for what's in progress.

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Base UI primitives)
- React Hook Form + Zod
- Sonner (toasts)

**Backend**
- Next.js Server Components & Server Actions (no separate API server)
- Prisma ORM 6.19
- PostgreSQL, hosted on Neon

**Auth & Infrastructure**
- Better Auth (email/password, session management)
- Cloudinary (profile image storage)
- Resend (transactional email for invitations)

---

## Key Features

### Authentication & Security
- Email/password sign-up, sign-in, and session management via Better Auth
- Server-side protected dashboard routes — every protected page re-verifies the session on the server, not just the client
- Password change with re-authentication, invalidating other active sessions on success
- Account deletion gated behind password re-verification, with cascading database cleanup of all associated data

### Projects & Tasks
- Full CRUD for projects (name, description, color, icon) and tasks (name, description, status, priority, due date)
- Server-side ownership checks on every mutation — the server independently verifies the resource belongs to the requesting user before acting on it, never trusting a client-supplied ID alone
- Task status history: every status transition is recorded (not just the current state), enabling accurate activity tracking
- URL-driven task filtering (status, priority, project, search text), sorting, and server-side pagination — filters persist through page refresh and are shareable as links
- Debounced search to avoid firing a database query on every keystroke

### Collaboration
- **Project Members & Roles** — a `ProjectMember` model (OWNER / ADMIN / MEMBER) layered onto the existing project-ownership model without breaking any pre-existing authorization logic
- **Email Invitations** — invite teammates by email via Resend; secure token-based accept links; handles logged-out visitors, email mismatches, expired/revoked/already-accepted states; idempotent accept flow wrapped in a database transaction
- Role-aware permissions: only OWNER/ADMIN can invite members or manage pending invitations; ADMIN cannot invite at OWNER-equivalent access

### Notifications
- Centralized notification creation, checked against per-user notification preferences before anything is written
- Notification dropdown with unread counts, mark-as-read / mark-all-as-read
- Notification types for task and project lifecycle events (created, updated, completed, deleted)

### Settings
- Profile management with Cloudinary-backed image upload/removal
- Security settings (password change)
- Notification preference toggles
- Danger Zone (account deletion)

---

## Architecture

FlowForge uses a **feature-based architecture** — functionality is organized by domain rather than by technical layer:

```
features/
├── auth/
├── projects/
├── tasks/
├── notifications/
├── settings/
├── members/
└── invitations/
    ├── actions/      ← Server Actions (mutations)
    ├── queries/       ← server-side data fetching
    ├── components/    ← feature-specific UI
    └── schemas/       ← Zod validation schemas
```

Shared UI lives in `components/`, infrastructure (auth config, Prisma client, Cloudinary, Resend) lives in `lib/`, and Next.js routes/layouts live in `app/`.

**Typical mutation flow:**

```
Form (React Hook Form)
   ↓
Zod validation (client)
   ↓
Server Action
   ↓
Session check (Better Auth)
   ↓
Zod validation (server — re-validated, never trusts the client)
   ↓
Authorization check (ownership / project membership)
   ↓
Prisma → PostgreSQL
   ↓
revalidatePath()
   ↓
Updated UI
```

This same pattern — authenticate, validate, authorize, mutate, revalidate — is applied consistently across projects, tasks, settings, and invitations.

---

## Getting Started

### Prerequisites
- Node.js
- A PostgreSQL database (this project uses [Neon](https://neon.tech))
- A [Resend](https://resend.com) account for invitation emails
- A [Cloudinary](https://cloudinary.com) account for profile images

### Setup

```bash
git clone <repo-url>
cd flowforge
npm install
```

Create a `.env.local` file with:

```env
DATABASE_URL=your_postgres_connection_string

RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev

NEXT_PUBLIC_APP_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the database migrations:

```bash
npx prisma migrate dev
node prisma/backfill-project-members.js   # one-time: backfills OWNER memberships for pre-existing projects
```

Start the dev server:

```bash
npm run dev
```

---

## Roadmap

**In progress**
- Surfacing projects a user has been invited to (not just owned) on the main Projects page
- In-app notifications for "invitation received" and "invitation accepted"
- A dedicated page listing invitations the current user has received, with Accept/Decline

**Planned**
- Kanban board (drag-and-drop between TODO / IN PROGRESS / DONE)
- Task assignees (schema already in place, UI/logic pending)
- Task comments
- Generalized activity/history feed
- Task labels
- Backlog & sprints
- File attachments on tasks

---

## Notable Engineering Decisions

- **Server Actions over a REST API** — mutations run as Next.js Server Actions rather than client → API route → database, reducing boilerplate while keeping all authentication, authorization, and validation logic strictly server-side.
- **Status history as a separate table, not just a status column** — `TaskStatusHistory` preserves every transition, not just the current state, since "where a task is now" and "how it got there" answer different questions.
- **URL as the source of truth for filters** — task filtering/sorting/pagination state lives in query parameters rather than local component state, so the server can use it directly and navigation/refresh/sharing all work naturally.
- **Additive schema design for collaboration** — when multi-user support was added, the existing single-owner model (`Project.ownerId`) and all its authorization checks were left untouched; `ProjectMember` was layered on top rather than replacing it, minimizing risk to already-working functionality.
- **Send-then-persist for invitations** — invitation emails are sent *before* the database record is written, so a failed email send never leaves an orphaned, unreachable invitation behind.
