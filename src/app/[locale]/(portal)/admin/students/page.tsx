import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";

export default async function AdminStudentsPage() {
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, audience, level, date_of_birth, parent_id, profiles:profiles!students_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Students</h1>
      <p className="mt-1 text-sm text-espresso-500">Everyone currently enrolled in the learning portal.</p>
      <DataTable
        columns={["Name", "Audience", "Level", "Managed by parent"]}
        rows={(students ?? []).map((s) => [
          s.profiles?.full_name ?? "—",
          s.audience,
          s.level ?? "—",
          s.parent_id ? "Yes" : "No",
        ])}
        emptyLabel="No students yet."
      />
    </div>
  );
}
