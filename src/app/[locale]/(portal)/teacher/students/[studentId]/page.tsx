import { getPortalUser } from "@/lib/portal/get-user";
import { FeedbackForm, GradeForm, AssignHomeworkForm } from "@/components/portal/teacher-student-panels";
import { notFound } from "next/navigation";

export default async function TeacherStudentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; studentId: string }>;
}) {
  const { locale, studentId } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: student } = await supabase
    .from("students")
    .select("*, profiles(full_name)")
    .eq("id", studentId)
    .single();

  if (!student) notFound();

  const [{ data: enrollments }, { data: quizAttempts }, { data: assignments }, { data: feedback }] = await Promise.all([
    supabase.from("enrollments").select("courses(name_vi, name_en)").eq("student_id", studentId),
    supabase.from("quiz_attempts").select("*, lessons(name_vi, name_en)").eq("student_id", studentId).order("submitted_at", { ascending: false }).limit(10),
    supabase
      .from("assignments")
      .select("*, assignment_submissions(*)")
      .eq("student_id", studentId)
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("teacher_feedback").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
  ]);

  const studentName = student.profiles?.full_name ?? "Student";

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-espresso-900">{studentName}</h1>
      <p className="text-sm text-espresso-500">
        {(enrollments ?? []).map((e) => (locale === "vi" ? e.courses?.name_vi : e.courses?.name_en)).join(", ") || "No course"}
        {" · "}
        {student.level ?? "Not yet assessed"}
      </p>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-espresso-900">Quiz results</h2>
        <div className="mt-3 space-y-2">
          {(quizAttempts ?? []).map((a) => (
            <div key={a.id} className="flex justify-between rounded-xl bg-cream-50 px-4 py-3 text-sm shadow-soft">
              <span className="text-espresso-700">{locale === "vi" ? a.lessons?.name_vi : a.lessons?.name_en}</span>
              <span className="font-semibold text-terracotta-600">{a.score}%</span>
            </div>
          ))}
          {!quizAttempts?.length && <p className="text-sm text-espresso-400">No quiz attempts yet.</p>}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-espresso-900">Assignments</h2>
          <AssignHomeworkForm studentId={studentId} />
        </div>
        <div className="mt-3 space-y-3">
          {(assignments ?? []).map((a) => {
            const submission = a.assignment_submissions?.[0];
            return (
              <div key={a.id} className="rounded-xl bg-cream-50 p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-espresso-800">{a.title_vi}</p>
                  <span className="text-xs text-espresso-400 capitalize">{submission?.status ?? "pending"}</span>
                </div>
                {submission?.response_text && (
                  <p className="mt-2 text-sm text-espresso-600">{submission.response_text}</p>
                )}
                {submission?.status === "submitted" && <GradeForm submissionId={submission.id} />}
                {submission?.status === "graded" && (
                  <p className="mt-2 text-sm text-green-700">
                    Grade: {submission.grade} — {submission.feedback_vi}
                  </p>
                )}
              </div>
            );
          })}
          {!assignments?.length && <p className="text-sm text-espresso-400">No assignments yet.</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-espresso-900">Teacher notes</h2>
        <div className="mt-3 space-y-2">
          {(feedback ?? []).map((f) => (
            <div key={f.id} className="rounded-xl bg-cream-50 px-4 py-3 text-sm text-espresso-600 shadow-soft">
              {f.note_vi}
              <span className="ml-2 text-xs text-espresso-300">{new Date(f.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <FeedbackForm studentId={studentId} />
        </div>
      </section>
    </div>
  );
}
