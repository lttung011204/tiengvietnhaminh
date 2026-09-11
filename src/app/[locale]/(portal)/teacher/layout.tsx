import { getTranslations } from "next-intl/server";
import { getPortalUser } from "@/lib/portal/get-user";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { LayoutDashboard, Users, GraduationCap, ClipboardList, TrendingUp } from "lucide-react";

export default async function TeacherLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile } = await getPortalUser(locale);
  const t = await getTranslations("dashboard.teacher.nav");

  const navItems: PortalNavItem[] = [
    { href: "/teacher", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/teacher/students", label: t("students"), icon: Users },
    { href: "/teacher/classes", label: t("classes"), icon: GraduationCap },
    { href: "/teacher/assignments", label: t("assignments"), icon: ClipboardList },
    { href: "/teacher/progress", label: t("progress"), icon: TrendingUp },
  ];

  return (
    <PortalShell navItems={navItems} userName={profile.full_name} roleLabel="Teacher">
      {children}
    </PortalShell>
  );
}
