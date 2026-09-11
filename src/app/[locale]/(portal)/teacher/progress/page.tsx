import { getPortalUser } from "@/lib/portal/get-user";
import { getTeacherStudents } from "@/lib/portal/teacher";
import { DataTable } from "@/components/admin/data-table";

export default async function TeacherProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);
  const students = await getTeacherStudents(supabase, user.id);

  const rows = await Promise.all(
    students.map(async (e) => {
      const { data: progress } = await supabase
        .from("course_progress")
        .select("percent_complete")
        .eq("student_id", e.student_id)
        .eq("course_id", e.course_id)
        .maybeSingle();
      return [
        e.students?.profiles?.full_name ?? "—",
        locale === "vi" ? e.courses?.name_vi : e.courses?.name_en,
        `${progress?.percent_complete ?? 0}%`,
      ];
    }),
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Student Progress</h1>
      <DataTable columns={["Student", "Course", "Progress"]} rows={rows} emptyLabel="No students yet." />
    </div>
  );
}
