import { getPortalUser } from "@/lib/portal/get-user";
import { GradeForm } from "@/components/portal/teacher-student-panels";

export default async function TeacherAssignmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: assignments } = await supabase
    .from("assignments")
    .select("*, students(profiles(full_name)), assignment_submissions(*)")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  const toReview = (assignments ?? []).filter((a) => a.assignment_submissions?.[0]?.status === "submitted");
  const others = (assignments ?? []).filter((a) => a.assignment_submissions?.[0]?.status !== "submitted");

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Assignments to Review</h1>

      <div className="mt-6 space-y-4">
        {toReview.map((a) => {
          const submission = a.assignment_submissions[0];
          return (
            <div key={a.id} className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-5 shadow-soft">
              <p className="font-semibold text-espresso-800">
                {a.title_vi}
                <span className="ml-2 font-normal text-espresso-400">— {a.students?.profiles?.full_name}</span>
              </p>
              {submission.response_text && <p className="mt-2 text-sm text-espresso-600">{submission.response_text}</p>}
              <GradeForm submissionId={submission.id} />
            </div>
          );
        })}
        {!toReview.length && <p className="text-espresso-400">Nothing waiting for review. 🎉</p>}
      </div>

      {others.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-espresso-900">All assignments</h2>
          <div className="mt-3 space-y-2">
            {others.map((a) => (
              <div key={a.id} className="flex justify-between rounded-xl bg-cream-50 px-4 py-3 text-sm shadow-soft">
                <span className="text-espresso-700">
                  {a.title_vi}
                  <span className="ml-2 text-espresso-400">— {a.students?.profiles?.full_name}</span>
                </span>
                <span className="text-xs text-espresso-400 capitalize">
                  {a.assignment_submissions?.[0]?.status ?? "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
