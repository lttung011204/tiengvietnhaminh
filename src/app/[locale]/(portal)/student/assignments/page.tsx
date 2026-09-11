import { getPortalUser } from "@/lib/portal/get-user";
import { AssignmentCard } from "@/components/portal/assignment-card";

export default async function StudentAssignmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: assignments } = await supabase
    .from("assignments")
    .select("*")
    .eq("student_id", user.id)
    .order("due_at", { ascending: true });

  const { data: submissions } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("student_id", user.id);

  const submissionByAssignment = new Map((submissions ?? []).map((s) => [s.assignment_id, s]));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Assignments</h1>
      <div className="mt-6 space-y-4">
        {(assignments ?? []).map((a) => (
          <AssignmentCard key={a.id} assignment={a} submission={submissionByAssignment.get(a.id) ?? null} locale={locale} />
        ))}
        {!assignments?.length && <p className="text-espresso-400">No assignments yet.</p>}
      </div>
    </div>
  );
}
