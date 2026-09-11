import { getPortalUser } from "@/lib/portal/get-user";
import { getTeacherStudents } from "@/lib/portal/teacher";
import { Link } from "@/i18n/navigation";
import { Users, ClipboardList, TrendingUp } from "lucide-react";

export default async function TeacherDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, profile, supabase } = await getPortalUser(locale);

  const students = await getTeacherStudents(supabase, user.id);

  const { count: toReview } = await supabase
    .from("assignment_submissions")
    .select("assignments!inner(teacher_id)", { count: "exact", head: true })
    .eq("status", "submitted")
    .eq("assignments.teacher_id", user.id);

  const stats = [
    { label: "My students", value: students.length, icon: Users, href: "/teacher/students" },
    { label: "Assignments to review", value: toReview ?? 0, icon: ClipboardList, href: "/teacher/assignments" },
    { label: "My classes", value: new Set(students.map((s) => s.course_id)).size, icon: TrendingUp, href: "/teacher/classes" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Welcome, {profile.full_name}</h1>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href as never}
            className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-6 shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <stat.icon className="text-terracotta-500" size={22} />
            <p className="mt-4 font-display text-3xl font-semibold text-espresso-900">{stat.value}</p>
            <p className="mt-1 text-sm text-espresso-500">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
