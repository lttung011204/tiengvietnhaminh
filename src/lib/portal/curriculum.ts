import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Lesson } from "@/types/database";

type DB = SupabaseClient<Database>;

export async function getPrimaryEnrollment(supabase: DB, studentId: string) {
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, course_id, courses(id, name_vi, name_en, level, programs(name_vi, name_en, audience))")
    .eq("student_id", studentId)
    .order("enrolled_at", { ascending: true })
    .limit(1);

  const enrollment = enrollments?.[0];
  if (!enrollment) return null;

  const { data: progress } = await supabase
    .from("course_progress")
    .select("*")
    .eq("student_id", studentId)
    .eq("course_id", enrollment.course_id)
    .maybeSingle();

  return { enrollment, progress };
}

export async function getNextLesson(supabase: DB, studentId: string, courseId: string): Promise<Lesson | null> {
  const { data: units } = await supabase
    .from("units")
    .select("id, sort_order")
    .eq("course_id", courseId)
    .order("sort_order");

  if (!units?.length) return null;

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .in(
      "unit_id",
      units.map((u) => u.id),
    )
    .eq("is_published", true);

  if (!lessons?.length) return null;

  const unitOrder = new Map(units.map((u) => [u.id, u.sort_order]));
  const sorted = [...lessons].sort((a, b) => {
    const unitDiff = (unitOrder.get(a.unit_id) ?? 0) - (unitOrder.get(b.unit_id) ?? 0);
    return unitDiff !== 0 ? unitDiff : a.sort_order - b.sort_order;
  });

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id, status")
    .eq("student_id", studentId)
    .in(
      "lesson_id",
      sorted.map((l) => l.id),
    );

  const completed = new Set((progressRows ?? []).filter((p) => p.status === "completed").map((p) => p.lesson_id));

  return sorted.find((l) => !completed.has(l.id)) ?? sorted[0] ?? null;
}
