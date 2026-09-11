import { getPortalUser } from "@/lib/portal/get-user";
import { getChildrenOverview } from "@/lib/portal/parent";
import { DataTable } from "@/components/admin/data-table";

export default async function ParentProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);
  const children = await getChildrenOverview(supabase, user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Progress</h1>
      <DataTable
        columns={["Child", "Course", "Progress", "This week"]}
        rows={children.map(({ student, primary, lessonsThisWeek }) => [
          student.profiles?.full_name ?? "—",
          (locale === "vi" ? primary?.enrollment.courses?.name_vi : primary?.enrollment.courses?.name_en) ?? "—",
          `${primary?.progress?.percent_complete ?? 0}%`,
          `${lessonsThisWeek} lessons`,
        ])}
        emptyLabel="No children added yet."
      />
    </div>
  );
}
