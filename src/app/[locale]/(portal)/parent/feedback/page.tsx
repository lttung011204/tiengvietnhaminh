import { getPortalUser } from "@/lib/portal/get-user";

export default async function ParentFeedbackPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: children } = await supabase.from("students").select("id").eq("parent_id", user.id);
  const studentIds = (children ?? []).map((c) => c.id);

  const { data: feedback } = studentIds.length
    ? await supabase
        .from("teacher_feedback")
        .select("*, students(profiles(full_name)), teachers(profiles(full_name))")
        .in("student_id", studentIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Teacher Feedback</h1>
      <div className="mt-6 space-y-4">
        {(feedback ?? []).map((f) => (
          <div key={f.id} className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-5 shadow-soft">
            <p className="text-sm text-espresso-700 italic">
              &ldquo;{locale === "vi" ? f.note_vi : f.note_en || f.note_vi}&rdquo;
            </p>
            <p className="mt-2 text-xs text-espresso-400">
              {f.teachers?.profiles?.full_name}, {new Date(f.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        {!feedback?.length && <p className="text-espresso-400">No feedback yet.</p>}
      </div>
    </div>
  );
}
