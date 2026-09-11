import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, status, enrolled_at, courses(name_en), students(profiles(full_name))")
    .order("enrolled_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Enrollments</h1>
      <p className="mt-1 text-sm text-espresso-500">Which students are enrolled in which courses.</p>
      <DataTable
        columns={["Student", "Course", "Status", "Enrolled"]}
        rows={(enrollments ?? []).map((e) => [
          e.students?.profiles?.full_name ?? "—",
          e.courses?.name_en ?? "—",
          e.status,
          new Date(e.enrolled_at).toLocaleDateString(),
        ])}
        emptyLabel="No enrollments yet."
      />
    </div>
  );
}
