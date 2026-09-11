import { getPortalUser } from "@/lib/portal/get-user";
import { getTeacherStudents } from "@/lib/portal/teacher";
import { Link } from "@/i18n/navigation";

export default async function TeacherStudentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);
  const students = await getTeacherStudents(supabase, user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">My Students</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((e) => (
          <Link
            key={e.student_id}
            href={`/teacher/students/${e.student_id}` as never}
            className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-5 shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <p className="font-semibold text-espresso-800">{e.students?.profiles?.full_name}</p>
            <p className="text-sm text-espresso-400">{locale === "vi" ? e.courses?.name_vi : e.courses?.name_en}</p>
          </Link>
        ))}
        {!students.length && <p className="text-espresso-400">No students assigned to your courses yet.</p>}
      </div>
    </div>
  );
}
