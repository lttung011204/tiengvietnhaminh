# Tiếng Việt Nhà Mình

Marketing site + learning portal (LMS) for a Vietnamese-language school serving Vietnamese families abroad.

- **Public site**: bilingual (VI/EN) marketing pages and a trial-class lead funnel.
- **Portal**: role-based app for students, parents, teachers, and admin — flashcard lessons for kids, structured lessons for adults, assignments, grading, and progress tracking.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, RLS) · next-intl · Framer Motion

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Create a free project at [supabase.com](https://supabase.com). Then, in the Supabase SQL Editor, run the files in order:

1. `supabase/migrations/0001_init.sql` — schema, RLS policies, and the new-user trigger.
2. `supabase/seed.sql` — a small sample curriculum (one kids flashcard lesson, one adult structured lesson) so the portal isn't empty.

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from **Project Settings → API** in the Supabase dashboard:

```bash
cp .env.local.example .env.local
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only (used when a parent creates a child's login) — never expose it to the browser.

### 4. Create the first admin account

Public sign-up only creates `parent` or `student` accounts. To get an `admin` (or `teacher`) account:

1. Sign up normally at `/signup`, or create a user from the Supabase dashboard (Authentication → Users → Add user).
2. In the SQL Editor, promote it:
   ```sql
   update profiles set role = 'admin' where id = '<user-uuid>';
   ```

### 5. Run the dev server

```bash
npm run dev
```

## Project structure

```
src/app/[locale]/(marketing)/   public site — home, trial form, thank-you
src/app/[locale]/(auth)/        login, signup
src/app/[locale]/(portal)/      role-protected app: student, parent, teacher, admin
src/components/                 UI, marketing sections, portal components
src/lib/supabase/               browser/server/admin Supabase clients
src/lib/portal/                 shared portal data-fetching helpers
src/types/database.ts           hand-written Supabase types (see note below)
supabase/migrations/            SQL schema + RLS
supabase/seed.sql               sample curriculum data
messages/{vi,en}.json           bilingual copy
```

## Notes on the schema

`profiles` mirrors `auth.users` 1:1; `teachers` / `parents` / `students` are subtype tables keyed by the same id. A teacher's "students" and "classes" are derived from `course_teachers` + `enrollments` — there's no separate roster table to keep in sync by hand. `course_progress` is a SQL view, computed on the fly, so it can never drift from `lesson_progress`.

Row Level Security enforces: students see only their own data; parents see only their linked children; teachers see only students enrolled in courses they teach; admins see everything.

Once the Supabase project is linked, replace `src/types/database.ts` with generated types for full accuracy:

```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

## What's built (Phase 1) vs. what's next (Phase 2)

**Working now**: bilingual marketing site, trial-lead funnel, auth + role-based routing, student/parent/teacher/admin dashboards, kids flashcard lessons with auto-graded review, adult structured lessons, assignments + grading, teacher feedback, admin lead management.

**Deliberately deferred**: payments/paid enrollment, audio recording & file submissions, class scheduling, email notifications, certificates, and a full admin UI for authoring courses/lessons (curriculum is managed via SQL/Supabase Studio for now — the data model already supports a future editor).
