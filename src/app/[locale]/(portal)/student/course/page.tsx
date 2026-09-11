import { getPortalUser } from "@/lib/portal/get-user";
import { Button } from "@/components/ui/button";

export default async function StudentCoursePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, course_id, courses(name_vi, name_en, level)")
    .eq("student_id", user.id);

  const { data: progressRows } = await supabase.from("course_progress").select("*").eq("student_id", user.id);
  const progressByCourse = new Map((progressRows ?? []).map((p) => [p.course_id, p]));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">My Courses</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {(enrollments ?? []).map((e) => {
          const progress = progressByCourse.get(e.course_id);
          const name = locale === "vi" ? e.courses?.name_vi : e.courses?.name_en;
          return (
            <div key={e.id} className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold text-espresso-900">{name}</h3>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-terracotta-500"
                  style={{ width: `${progress?.percent_complete ?? 0}%` }}
                />
              </div>
              <p className="mt-1.5 text-sm text-espresso-400">{progress?.percent_complete ?? 0}% complete</p>
              <Button href="/student" variant="secondary" size="sm" className="mt-4">
                Continue
              </Button>
            </div>
          );
        })}

        {!enrollments?.length && <p className="text-espresso-400">No courses yet.</p>}
      </div>
    </div>
  );
}
