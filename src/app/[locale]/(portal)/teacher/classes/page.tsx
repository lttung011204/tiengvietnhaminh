import { getPortalUser } from "@/lib/portal/get-user";

export default async function TeacherClassesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: courseTeachers } = await supabase
    .from("course_teachers")
    .select("courses(id, name_vi, name_en, level)")
    .eq("teacher_id", user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">My Classes</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(courseTeachers ?? []).map((ct, i) => (
          <div key={i} className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-5 shadow-soft">
            <p className="font-semibold text-espresso-800">{locale === "vi" ? ct.courses?.name_vi : ct.courses?.name_en}</p>
            <p className="text-sm text-espresso-400 capitalize">{ct.courses?.level}</p>
          </div>
        ))}
        {!courseTeachers?.length && <p className="text-espresso-400">No classes assigned yet.</p>}
      </div>
    </div>
  );
}
