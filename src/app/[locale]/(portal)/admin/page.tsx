import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { Inbox, Users, GraduationCap, BookOpen } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: newLeads }, { count: students }, { count: teachers }, { count: courses }] = await Promise.all([
    supabase.from("trial_leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("teachers").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "New trial leads", value: newLeads ?? 0, icon: Inbox, href: "/admin/leads" },
    { label: "Students", value: students ?? 0, icon: Users, href: "/admin/students" },
    { label: "Teachers", value: teachers ?? 0, icon: GraduationCap, href: "/admin/teachers" },
    { label: "Courses", value: courses ?? 0, icon: BookOpen, href: "/admin/courses" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Admin overview</h1>
      <p className="mt-1 text-sm text-espresso-500">A quick snapshot of the funnel and the school.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
