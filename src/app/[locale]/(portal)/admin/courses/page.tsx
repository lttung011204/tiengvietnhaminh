import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, name_en, level, is_published, programs(name_en, audience)")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Courses</h1>
      <p className="mt-1 text-sm text-espresso-500">
        Curriculum content is managed directly in Supabase for now — a dedicated course/lesson editor is a
        natural Phase 2 addition.
      </p>
      <DataTable
        columns={["Course", "Program", "Level", "Published"]}
        rows={(courses ?? []).map((c) => [
          c.name_en,
          c.programs?.name_en ?? "—",
          c.level,
          c.is_published ? "Yes" : "Draft",
        ])}
        emptyLabel="No courses yet — run supabase/seed.sql to add sample curriculum."
      />
    </div>
  );
}
