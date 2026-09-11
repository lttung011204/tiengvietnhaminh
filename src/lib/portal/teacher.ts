import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type DB = SupabaseClient<Database>;

export async function getTeacherCourseIds(supabase: DB, teacherId: string) {
  const { data } = await supabase.from("course_teachers").select("course_id").eq("teacher_id", teacherId);
  return (data ?? []).map((r) => r.course_id);
}

export async function getTeacherStudents(supabase: DB, teacherId: string) {
  const courseIds = await getTeacherCourseIds(supabase, teacherId);
  if (!courseIds.length) return [];

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id, course_id, courses(name_vi, name_en), students(id, level, profiles(full_name))")
    .in("course_id", courseIds);

  const seen = new Set<string>();
  return (enrollments ?? []).filter((e) => {
    if (seen.has(e.student_id)) return false;
    seen.add(e.student_id);
    return true;
  });
}
