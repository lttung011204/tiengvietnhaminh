import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";

export default async function AdminTeachersPage() {
  const supabase = await createClient();
  const { data: teachers } = await supabase
    .from("teachers")
    .select("id, years_experience, profiles:profiles!teachers_id_fkey(full_name)");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Teachers</h1>
      <p className="mt-1 text-sm text-espresso-500">Teaching staff shown on the public site and in the portal.</p>
      <DataTable
        columns={["Name", "Years experience"]}
        rows={(teachers ?? []).map((t) => [
          t.profiles?.full_name ?? "—",
          t.years_experience ?? "—",
        ])}
        emptyLabel="No teachers yet."
      />
    </div>
  );
}
