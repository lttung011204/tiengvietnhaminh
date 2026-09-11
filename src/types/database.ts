// Hand-written to match supabase/migrations/0001_init.sql.
// Once the project is linked, replace with:
//   npx supabase gen types typescript --linked > src/types/database.ts

export type UserRole = "admin" | "teacher" | "parent" | "student";
export type AudienceType = "kids" | "adults";
export type LevelCode = "beginner" | "elementary" | "intermediate" | "advanced";
export type LessonFormatType = "flashcard" | "structured";
export type LessonBlockType =
  | "vocabulary"
  | "dialogue"
  | "listening"
  | "reading"
  | "grammar"
  | "speaking_prompt"
  | "writing_exercise"
  | "quiz"
  | "teacher_assignment";
export type QuizQuestionType = "multiple_choice" | "match_image_word" | "listen_choice" | "fill_blank";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type AssignmentType = "open_response" | "speaking" | "writing";
export type SubmissionStatus = "pending" | "submitted" | "graded";
export type LeadStatus = "new" | "contacted" | "trial_scheduled" | "trial_completed" | "enrolled" | "not_enrolled";

type Relationship = {
  foreignKeyName: string;
  columns: readonly string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: readonly string[];
};

// Insert/Update are approximated as Partial<Row> rather than precisely
// modeling which columns have DB defaults — good enough for a hand-written
// stand-in; real codegen (see note above) will tighten this. Relationships
// mirror Postgres' default `<table>_<column>_fkey` constraint names, which
// is what our migration relies on (no FKs are explicitly named) — needed so
// postgrest-js can type-check embedded/joined `.select()` calls.
type Table<Row, Rel extends readonly Relationship[] = [], Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Rel;
};

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  locale: string;
  created_at: string;
}

export type Teacher = {
  id: string;
  bio_vi: string | null;
  bio_en: string | null;
  years_experience: number | null;
  photo_url: string | null;
}

export type Parent = {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  timezone: string | null;
}

export type Student = {
  id: string;
  parent_id: string | null;
  date_of_birth: string | null;
  audience: AudienceType;
  level: LevelCode | null;
  created_at: string;
}

export type Program = {
  id: string;
  slug: string;
  audience: AudienceType;
  name_vi: string;
  name_en: string;
  description_vi: string | null;
  description_en: string | null;
  is_published: boolean;
  sort_order: number;
}

export type Course = {
  id: string;
  program_id: string;
  slug: string;
  level: LevelCode;
  name_vi: string;
  name_en: string;
  description_vi: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export type CourseTeacher = {
  course_id: string;
  teacher_id: string;
}

export type Unit = {
  id: string;
  course_id: string;
  name_vi: string;
  name_en: string;
  sort_order: number;
}

export type Lesson = {
  id: string;
  unit_id: string;
  format: LessonFormatType;
  name_vi: string;
  name_en: string;
  estimated_minutes: number | null;
  is_published: boolean;
  sort_order: number;
}

export type LessonBlock = {
  id: string;
  lesson_id: string;
  block_type: LessonBlockType;
  title_vi: string | null;
  title_en: string | null;
  content: Record<string, unknown>;
  audio_url: string | null;
  sort_order: number;
}

export type Flashcard = {
  id: string;
  lesson_id: string;
  image_url: string | null;
  word_vi: string;
  word_en: string | null;
  example_sentence_vi: string | null;
  example_sentence_en: string | null;
  audio_url: string | null;
  sort_order: number;
}

export type QuizQuestion = {
  id: string;
  lesson_id: string;
  lesson_block_id: string | null;
  question_type: QuizQuestionType;
  prompt_vi: string | null;
  prompt_en: string | null;
  image_url: string | null;
  audio_url: string | null;
  sort_order: number;
}

export type QuizOption = {
  id: string;
  question_id: string;
  label_vi: string | null;
  label_en: string | null;
  image_url: string | null;
  is_correct: boolean;
  sort_order: number;
}

export type Enrollment = {
  id: string;
  student_id: string;
  course_id: string;
  status: string;
  enrolled_at: string;
}

export type LessonProgress = {
  id: string;
  student_id: string;
  lesson_id: string;
  status: ProgressStatus;
  score: number | null;
  cards_known: number;
  cards_total: number;
  completed_at: string | null;
  updated_at: string;
}

export type QuizAttempt = {
  id: string;
  student_id: string;
  lesson_id: string;
  score: number;
  submitted_at: string;
}

export type QuizResponse = {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean;
}

export type CourseProgress = {
  student_id: string;
  course_id: string;
  lessons_completed: number;
  lessons_total: number;
  percent_complete: number;
}

export type Assignment = {
  id: string;
  teacher_id: string;
  student_id: string;
  lesson_id: string | null;
  type: AssignmentType;
  title_vi: string;
  title_en: string | null;
  instructions_vi: string | null;
  instructions_en: string | null;
  due_at: string | null;
  created_at: string;
}

export type AssignmentSubmission = {
  id: string;
  assignment_id: string;
  student_id: string;
  status: SubmissionStatus;
  response_text: string | null;
  submitted_at: string | null;
  grade: number | null;
  feedback_vi: string | null;
  feedback_en: string | null;
  graded_at: string | null;
  graded_by: string | null;
}

export type TeacherFeedback = {
  id: string;
  teacher_id: string;
  student_id: string;
  note_vi: string;
  note_en: string | null;
  created_at: string;
}

export type TrialLead = {
  id: string;
  parent_name: string;
  student_name: string;
  student_age: number | null;
  country: string | null;
  timezone: string | null;
  vietnamese_level: string | null;
  learning_goal: string | null;
  phone: string | null;
  email: string;
  preferred_contact_method: string | null;
  preferred_class_time: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile>;
      teachers: Table<
        Teacher,
        [{ foreignKeyName: "teachers_id_fkey"; columns: ["id"]; isOneToOne: true; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      >;
      parents: Table<
        Parent,
        [{ foreignKeyName: "parents_id_fkey"; columns: ["id"]; isOneToOne: true; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      >;
      students: Table<
        Student,
        [
          { foreignKeyName: "students_id_fkey"; columns: ["id"]; isOneToOne: true; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "students_parent_id_fkey"; columns: ["parent_id"]; isOneToOne: false; referencedRelation: "parents"; referencedColumns: ["id"] },
        ]
      >;
      programs: Table<Program>;
      courses: Table<
        Course,
        [{ foreignKeyName: "courses_program_id_fkey"; columns: ["program_id"]; isOneToOne: false; referencedRelation: "programs"; referencedColumns: ["id"] }]
      >;
      course_teachers: Table<
        CourseTeacher,
        [
          { foreignKeyName: "course_teachers_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] },
          { foreignKeyName: "course_teachers_teacher_id_fkey"; columns: ["teacher_id"]; isOneToOne: false; referencedRelation: "teachers"; referencedColumns: ["id"] },
        ]
      >;
      units: Table<
        Unit,
        [{ foreignKeyName: "units_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }]
      >;
      lessons: Table<
        Lesson,
        [{ foreignKeyName: "lessons_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "units"; referencedColumns: ["id"] }]
      >;
      lesson_blocks: Table<
        LessonBlock,
        [{ foreignKeyName: "lesson_blocks_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] }]
      >;
      flashcards: Table<
        Flashcard,
        [{ foreignKeyName: "flashcards_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] }]
      >;
      quiz_questions: Table<
        QuizQuestion,
        [
          { foreignKeyName: "quiz_questions_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] },
          { foreignKeyName: "quiz_questions_lesson_block_id_fkey"; columns: ["lesson_block_id"]; isOneToOne: false; referencedRelation: "lesson_blocks"; referencedColumns: ["id"] },
        ]
      >;
      quiz_options: Table<
        QuizOption,
        [{ foreignKeyName: "quiz_options_question_id_fkey"; columns: ["question_id"]; isOneToOne: false; referencedRelation: "quiz_questions"; referencedColumns: ["id"] }]
      >;
      enrollments: Table<
        Enrollment,
        [
          { foreignKeyName: "enrollments_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "students"; referencedColumns: ["id"] },
          { foreignKeyName: "enrollments_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] },
        ]
      >;
      lesson_progress: Table<
        LessonProgress,
        [
          { foreignKeyName: "lesson_progress_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "students"; referencedColumns: ["id"] },
          { foreignKeyName: "lesson_progress_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] },
        ]
      >;
      quiz_attempts: Table<
        QuizAttempt,
        [
          { foreignKeyName: "quiz_attempts_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "students"; referencedColumns: ["id"] },
          { foreignKeyName: "quiz_attempts_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] },
        ]
      >;
      quiz_responses: Table<
        QuizResponse,
        [
          { foreignKeyName: "quiz_responses_attempt_id_fkey"; columns: ["attempt_id"]; isOneToOne: false; referencedRelation: "quiz_attempts"; referencedColumns: ["id"] },
          { foreignKeyName: "quiz_responses_question_id_fkey"; columns: ["question_id"]; isOneToOne: false; referencedRelation: "quiz_questions"; referencedColumns: ["id"] },
          { foreignKeyName: "quiz_responses_selected_option_id_fkey"; columns: ["selected_option_id"]; isOneToOne: false; referencedRelation: "quiz_options"; referencedColumns: ["id"] },
        ]
      >;
      assignments: Table<
        Assignment,
        [
          { foreignKeyName: "assignments_teacher_id_fkey"; columns: ["teacher_id"]; isOneToOne: false; referencedRelation: "teachers"; referencedColumns: ["id"] },
          { foreignKeyName: "assignments_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "students"; referencedColumns: ["id"] },
          { foreignKeyName: "assignments_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] },
        ]
      >;
      assignment_submissions: Table<
        AssignmentSubmission,
        [
          { foreignKeyName: "assignment_submissions_assignment_id_fkey"; columns: ["assignment_id"]; isOneToOne: false; referencedRelation: "assignments"; referencedColumns: ["id"] },
          { foreignKeyName: "assignment_submissions_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "students"; referencedColumns: ["id"] },
          { foreignKeyName: "assignment_submissions_graded_by_fkey"; columns: ["graded_by"]; isOneToOne: false; referencedRelation: "teachers"; referencedColumns: ["id"] },
        ]
      >;
      teacher_feedback: Table<
        TeacherFeedback,
        [
          { foreignKeyName: "teacher_feedback_teacher_id_fkey"; columns: ["teacher_id"]; isOneToOne: false; referencedRelation: "teachers"; referencedColumns: ["id"] },
          { foreignKeyName: "teacher_feedback_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "students"; referencedColumns: ["id"] },
        ]
      >;
      trial_leads: Table<TrialLead>;
    };
    Views: {
      course_progress: { Row: CourseProgress; Relationships: [] };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      audience_type: AudienceType;
      level_code: LevelCode;
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
