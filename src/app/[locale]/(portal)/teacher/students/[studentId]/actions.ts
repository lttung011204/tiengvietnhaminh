"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTeacherFeedback(studentId: string, noteVi: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { error } = await supabase
    .from("teacher_feedback")
    .insert({ teacher_id: user.id, student_id: studentId, note_vi: noteVi });

  if (error) return { ok: false as const };
  revalidatePath("/[locale]/teacher/students/[studentId]", "page");
  return { ok: true as const };
}

export async function gradeSubmission(submissionId: string, grade: number, feedbackVi: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { error } = await supabase
    .from("assignment_submissions")
    .update({ status: "graded", grade, feedback_vi: feedbackVi, graded_at: new Date().toISOString(), graded_by: user.id })
    .eq("id", submissionId);

  if (error) return { ok: false as const };
  revalidatePath("/[locale]/teacher/students/[studentId]", "page");
  revalidatePath("/[locale]/teacher/assignments", "page");
  return { ok: true as const };
}

export async function assignHomework({
  studentId,
  titleVi,
  instructionsVi,
  type,
}: {
  studentId: string;
  titleVi: string;
  instructionsVi: string;
  type: "open_response" | "speaking" | "writing";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { error } = await supabase
    .from("assignments")
    .insert({ teacher_id: user.id, student_id: studentId, title_vi: titleVi, instructions_vi: instructionsVi, type });

  if (error) return { ok: false as const };
  revalidatePath("/[locale]/teacher/students/[studentId]", "page");
  return { ok: true as const };
}
