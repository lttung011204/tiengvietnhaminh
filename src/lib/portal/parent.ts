import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getPrimaryEnrollment } from "./curriculum";

type DB = SupabaseClient<Database>;

export async function getChildrenOverview(supabase: DB, parentId: string) {
  const { data: students } = await supabase
    .from("students")
    .select("*, profiles(full_name)")
    .eq("parent_id", parentId);

  if (!students?.length) return [];

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  return Promise.all(
    students.map(async (student) => {
      const primary = await getPrimaryEnrollment(supabase, student.id);

      const { data: feedback } = await supabase
        .from("teacher_feedback")
        .select("*, teachers(profiles(full_name))")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: recent } = await supabase
        .from("lesson_progress")
        .select("cards_known")
        .eq("student_id", student.id)
        .eq("status", "completed")
        .gte("completed_at", weekAgo);

      return {
        student,
        primary,
        feedback,
        lessonsThisWeek: recent?.length ?? 0,
        wordsThisWeek: (recent ?? []).reduce((sum, r) => sum + (r.cards_known ?? 0), 0),
      };
    }),
  );
}
