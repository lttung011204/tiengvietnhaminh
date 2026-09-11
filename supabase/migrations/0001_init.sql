-- Tiếng Việt Nhà Mình — initial schema
-- Design notes (deviations from the brief, for clarity):
--  * profiles / teachers / parents / students use a shared-PK "subtype" pattern
--    (each subtype row's id IS the profiles.id IS the auth.users.id). This removes
--    the need for a separate parent_students join table: a student's parent is
--    just students.parent_id, since in this MVP a child has exactly one parent account.
--  * "Classes" are not a separate entity. A teacher is linked to the courses they
--    teach via course_teachers; "my students" = students enrolled in those courses.
--    This avoids maintaining a redundant roster by hand.
--  * course_progress is a view (computed), not a synced table, so it can't drift.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────
create type user_role as enum ('admin', 'teacher', 'parent', 'student');
create type audience_type as enum ('kids', 'adults');
create type level_code as enum ('beginner', 'elementary', 'intermediate', 'advanced');
create type lesson_format as enum ('flashcard', 'structured');
create type lesson_block_type as enum (
  'vocabulary', 'dialogue', 'listening', 'reading', 'grammar',
  'speaking_prompt', 'writing_exercise', 'quiz', 'teacher_assignment'
);
create type quiz_question_type as enum ('multiple_choice', 'match_image_word', 'listen_choice', 'fill_blank');
create type progress_status as enum ('not_started', 'in_progress', 'completed');
create type assignment_type as enum ('open_response', 'speaking', 'writing');
create type submission_status as enum ('pending', 'submitted', 'graded');
create type lead_status as enum ('new', 'contacted', 'trial_scheduled', 'trial_completed', 'enrolled', 'not_enrolled');

-- ─────────────────────────────────────────────────────────────────────────
-- Identity: profiles (1:1 with auth.users) + role subtype tables
-- ─────────────────────────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  avatar_url text,
  locale text not null default 'vi',
  created_at timestamptz not null default now()
);

create table teachers (
  id uuid primary key references profiles(id) on delete cascade,
  bio_vi text,
  bio_en text,
  years_experience int,
  photo_url text
);

create table parents (
  id uuid primary key references profiles(id) on delete cascade,
  phone text,
  whatsapp text,
  country text,
  timezone text
);

create table students (
  id uuid primary key references profiles(id) on delete cascade,
  parent_id uuid references parents(id) on delete set null, -- null = independent adult learner
  date_of_birth date,
  audience audience_type not null,
  level level_code,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Curriculum: Program → Course → Unit → Lesson → (blocks | flashcards)
-- ─────────────────────────────────────────────────────────────────────────
create table programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  audience audience_type not null,
  name_vi text not null,
  name_en text not null,
  description_vi text,
  description_en text,
  is_published boolean not null default false,
  sort_order int not null default 0
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  slug text not null unique,
  level level_code not null,
  name_vi text not null,
  name_en text not null,
  description_vi text,
  description_en text,
  cover_image_url text,
  is_published boolean not null default false,
  sort_order int not null default 0
);

create table course_teachers (
  course_id uuid not null references courses(id) on delete cascade,
  teacher_id uuid not null references teachers(id) on delete cascade,
  primary key (course_id, teacher_id)
);

create table units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  name_vi text not null,
  name_en text not null,
  sort_order int not null default 0
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  format lesson_format not null,
  name_vi text not null,
  name_en text not null,
  estimated_minutes int,
  is_published boolean not null default false,
  sort_order int not null default 0
);

-- Adult ("structured") lessons: ordered, reusable content blocks.
create table lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  block_type lesson_block_type not null,
  title_vi text,
  title_en text,
  content jsonb not null default '{}'::jsonb, -- shape varies by block_type
  audio_url text,
  sort_order int not null default 0
);

-- Kids ("flashcard") lessons: the core content unit.
create table flashcards (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  image_url text,
  word_vi text not null,
  word_en text,
  example_sentence_vi text,
  example_sentence_en text,
  audio_url text,
  sort_order int not null default 0
);

-- Review/quiz questions. Attached either directly to a flashcard lesson
-- (kids review activity) or to a 'quiz' lesson_block (adult quiz).
create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  lesson_block_id uuid references lesson_blocks(id) on delete cascade,
  question_type quiz_question_type not null,
  prompt_vi text,
  prompt_en text,
  image_url text,
  audio_url text,
  sort_order int not null default 0
);

create table quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references quiz_questions(id) on delete cascade,
  label_vi text,
  label_en text,
  image_url text,
  is_correct boolean not null default false,
  sort_order int not null default 0
);

-- ─────────────────────────────────────────────────────────────────────────
-- Enrollment & progress
-- ─────────────────────────────────────────────────────────────────────────
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  status text not null default 'active',
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  status progress_status not null default 'not_started',
  score numeric,
  cards_known int not null default 0,
  cards_total int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  score numeric not null default 0,
  submitted_at timestamptz not null default now()
);

create table quiz_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references quiz_attempts(id) on delete cascade,
  question_id uuid not null references quiz_questions(id) on delete cascade,
  selected_option_id uuid references quiz_options(id),
  is_correct boolean not null default false
);

-- Course-level progress, derived — never stored, so it can't go stale.
create view course_progress as
select
  e.student_id,
  e.course_id,
  count(lp.id) filter (where lp.status = 'completed') as lessons_completed,
  count(l.id) as lessons_total,
  case when count(l.id) = 0 then 0
    else round(100.0 * count(lp.id) filter (where lp.status = 'completed') / count(l.id))
  end as percent_complete
from enrollments e
join courses c on c.id = e.course_id
join units u on u.course_id = c.id
join lessons l on l.unit_id = u.id and l.is_published
left join lesson_progress lp on lp.lesson_id = l.id and lp.student_id = e.student_id
group by e.student_id, e.course_id;

-- ─────────────────────────────────────────────────────────────────────────
-- Assignments (teacher-set homework, distinct from in-lesson quizzes)
-- ─────────────────────────────────────────────────────────────────────────
create table assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  type assignment_type not null default 'open_response',
  title_vi text not null,
  title_en text,
  instructions_vi text,
  instructions_en text,
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  status submission_status not null default 'pending',
  response_text text,
  submitted_at timestamptz,
  grade numeric,
  feedback_vi text,
  feedback_en text,
  graded_at timestamptz,
  graded_by uuid references teachers(id),
  unique (assignment_id, student_id)
);

create table teacher_feedback (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  note_vi text not null,
  note_en text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Public funnel: trial leads (no auth required to insert)
-- ─────────────────────────────────────────────────────────────────────────
create table trial_leads (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  student_name text not null,
  student_age int,
  country text,
  timezone text,
  vietnamese_level text,
  learning_goal text,
  phone text,
  email text not null,
  preferred_contact_method text,
  preferred_class_time text,
  status lead_status not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- RLS helper functions (SECURITY DEFINER to avoid recursive-policy issues)
-- ─────────────────────────────────────────────────────────────────────────
create function is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create function is_parent_of(p_student_id uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from students where id = p_student_id and parent_id = auth.uid());
$$;

create function is_teacher_of(p_student_id uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from enrollments e
    join course_teachers ct on ct.course_id = e.course_id
    where e.student_id = p_student_id and ct.teacher_id = auth.uid()
  );
$$;

create function can_access_student(p_student_id uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select p_student_id = auth.uid() or is_parent_of(p_student_id) or is_teacher_of(p_student_id) or is_admin();
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- RLS policies
-- ─────────────────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table teachers enable row level security;
alter table parents enable row level security;
alter table students enable row level security;
alter table programs enable row level security;
alter table courses enable row level security;
alter table course_teachers enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;
alter table lesson_blocks enable row level security;
alter table flashcards enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_options enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table quiz_attempts enable row level security;
alter table quiz_responses enable row level security;
alter table assignments enable row level security;
alter table assignment_submissions enable row level security;
alter table teacher_feedback enable row level security;
alter table trial_leads enable row level security;

-- profiles
create policy "profiles self select" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles self update" on profiles for update using (id = auth.uid() or is_admin());
create policy "profiles admin insert" on profiles for insert with check (id = auth.uid() or is_admin());

-- teachers: bio/photo are also shown on the public marketing site
create policy "teachers public read" on teachers for select using (true);
create policy "teachers self update" on teachers for update using (id = auth.uid() or is_admin());
create policy "teachers admin write" on teachers for insert with check (is_admin());

-- parents
create policy "parents self" on parents for select using (id = auth.uid() or is_admin());
create policy "parents self update" on parents for update using (id = auth.uid() or is_admin());
create policy "parents admin insert" on parents for insert with check (id = auth.uid() or is_admin());

-- students
create policy "students access" on students for select using (can_access_student(id));
create policy "students parent update" on students for update using (parent_id = auth.uid() or id = auth.uid() or is_admin());
create policy "students insert" on students for insert with check (parent_id = auth.uid() or id = auth.uid() or is_admin());

-- curriculum: published content is readable by any authenticated user;
-- admins/teachers can manage it.
create policy "programs read" on programs for select using (is_published or is_admin());
create policy "programs admin write" on programs for insert with check (is_admin());
create policy "programs admin update" on programs for update using (is_admin());

create policy "courses read" on courses for select using (is_published or is_admin());
create policy "courses admin write" on courses for insert with check (is_admin());
create policy "courses admin update" on courses for update using (is_admin());

create policy "course_teachers read" on course_teachers for select using (true);
create policy "course_teachers admin write" on course_teachers for insert with check (is_admin());
create policy "course_teachers admin delete" on course_teachers for delete using (is_admin());

create policy "units read" on units for select using (
  exists (select 1 from courses c where c.id = course_id and (c.is_published or is_admin()))
);
create policy "units admin write" on units for insert with check (is_admin());
create policy "units admin update" on units for update using (is_admin());

create policy "lessons read" on lessons for select using (is_published or is_admin());
create policy "lessons admin write" on lessons for insert with check (is_admin());
create policy "lessons admin update" on lessons for update using (is_admin());

create policy "lesson_blocks read" on lesson_blocks for select using (
  exists (select 1 from lessons l where l.id = lesson_id and (l.is_published or is_admin()))
);
create policy "lesson_blocks admin write" on lesson_blocks for insert with check (is_admin());
create policy "lesson_blocks admin update" on lesson_blocks for update using (is_admin());

create policy "flashcards read" on flashcards for select using (
  exists (select 1 from lessons l where l.id = lesson_id and (l.is_published or is_admin()))
);
create policy "flashcards admin write" on flashcards for insert with check (is_admin());
create policy "flashcards admin update" on flashcards for update using (is_admin());

create policy "quiz_questions read" on quiz_questions for select using (
  exists (select 1 from lessons l where l.id = lesson_id and (l.is_published or is_admin()))
);
create policy "quiz_questions admin write" on quiz_questions for insert with check (is_admin());
create policy "quiz_questions admin update" on quiz_questions for update using (is_admin());

create policy "quiz_options read" on quiz_options for select using (
  exists (
    select 1 from quiz_questions q join lessons l on l.id = q.lesson_id
    where q.id = question_id and (l.is_published or is_admin())
  )
);
create policy "quiz_options admin write" on quiz_options for insert with check (is_admin());
create policy "quiz_options admin update" on quiz_options for update using (is_admin());

-- enrollment / progress: visible to the student, their parent, their teacher, or admin
create policy "enrollments access" on enrollments for select using (can_access_student(student_id));
create policy "enrollments admin write" on enrollments for insert with check (is_admin() or student_id = auth.uid());

create policy "lesson_progress access" on lesson_progress for select using (can_access_student(student_id));
create policy "lesson_progress student write" on lesson_progress for insert with check (student_id = auth.uid() or is_admin());
create policy "lesson_progress student update" on lesson_progress for update using (student_id = auth.uid() or is_admin());

create policy "quiz_attempts access" on quiz_attempts for select using (can_access_student(student_id));
create policy "quiz_attempts student write" on quiz_attempts for insert with check (student_id = auth.uid() or is_admin());

create policy "quiz_responses access" on quiz_responses for select using (
  exists (select 1 from quiz_attempts a where a.id = attempt_id and can_access_student(a.student_id))
);
create policy "quiz_responses student write" on quiz_responses for insert with check (
  exists (select 1 from quiz_attempts a where a.id = attempt_id and (a.student_id = auth.uid() or is_admin()))
);

-- assignments: student/parent can read; teacher who owns it can read/write; admin all
create policy "assignments access" on assignments for select using (
  can_access_student(student_id) or teacher_id = auth.uid()
);
create policy "assignments teacher write" on assignments for insert with check (teacher_id = auth.uid() or is_admin());
create policy "assignments teacher update" on assignments for update using (teacher_id = auth.uid() or is_admin());

create policy "submissions access" on assignment_submissions for select using (
  can_access_student(student_id)
  or exists (select 1 from assignments a where a.id = assignment_id and a.teacher_id = auth.uid())
);
create policy "submissions student write" on assignment_submissions for insert with check (student_id = auth.uid() or is_admin());
create policy "submissions update" on assignment_submissions for update using (
  student_id = auth.uid()
  or is_admin()
  or exists (select 1 from assignments a where a.id = assignment_id and a.teacher_id = auth.uid())
);

create policy "teacher_feedback access" on teacher_feedback for select using (can_access_student(student_id));
create policy "teacher_feedback teacher write" on teacher_feedback for insert with check (teacher_id = auth.uid() or is_admin());

-- trial_leads: anyone (including anonymous site visitors) can submit; only staff can read/manage
create policy "trial_leads public insert" on trial_leads for insert with check (true);
create policy "trial_leads staff read" on trial_leads for select using (is_admin());
create policy "trial_leads staff update" on trial_leads for update using (is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- New-user bootstrap: create a profiles row whenever a Supabase auth user
-- is created, reading role/full_name out of the signup's user_metadata.
-- ─────────────────────────────────────────────────────────────────────────
create function handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, locale)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', 'New user'),
    coalesce(new.raw_user_meta_data->>'locale', 'vi')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
