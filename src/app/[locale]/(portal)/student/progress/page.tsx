import { getPortalUser } from "@/lib/portal/get-user";
import { DataTable } from "@/components/admin/data-table";

export default async function StudentProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: rows } = await supabase
    .from("lesson_progress")
    .select("id, status, score, cards_known, cards_total, updated_at, lessons(name_vi, name_en)")
    .eq("student_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">My Progress</h1>
      <DataTable
        columns={["Lesson", "Status", "Score", "Cards known", "Updated"]}
        rows={(rows ?? []).map((r) => [
          (locale === "vi" ? r.lessons?.name_vi : r.lessons?.name_en) ?? "—",
          r.status,
          r.score != null ? `${r.score}%` : "—",
          `${r.cards_known}/${r.cards_total}`,
          new Date(r.updated_at).toLocaleDateString(),
        ])}
        emptyLabel="No lessons completed yet — go finish your first one!"
      />
    </div>
  );
}
