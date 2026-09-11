import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";

export default async function AdminParentsPage() {
  const supabase = await createClient();
  const { data: parents } = await supabase
    .from("parents")
    .select("id, phone, country, profiles:profiles!parents_id_fkey(full_name)");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Parents</h1>
      <p className="mt-1 text-sm text-espresso-500">Parent accounts and their contact details.</p>
      <DataTable
        columns={["Name", "Phone", "Country"]}
        rows={(parents ?? []).map((p) => [
          p.profiles?.full_name ?? "—",
          p.phone ?? "—",
          p.country ?? "—",
        ])}
        emptyLabel="No parent accounts yet."
      />
    </div>
  );
}
