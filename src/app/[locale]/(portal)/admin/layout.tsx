import { getTranslations } from "next-intl/server";
import { getPortalUser } from "@/lib/portal/get-user";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { LayoutDashboard, Inbox, Users, UserCog, GraduationCap, BookOpen, ListChecks } from "lucide-react";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile } = await getPortalUser(locale);
  const t = await getTranslations("dashboard.admin.nav");

  const navItems: PortalNavItem[] = [
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/leads", label: t("leads"), icon: Inbox },
    { href: "/admin/students", label: t("students"), icon: Users },
    { href: "/admin/parents", label: t("parents"), icon: UserCog },
    { href: "/admin/teachers", label: t("teachers"), icon: GraduationCap },
    { href: "/admin/courses", label: t("courses"), icon: BookOpen },
    { href: "/admin/enrollments", label: t("enrollments"), icon: ListChecks },
  ];

  return (
    <PortalShell navItems={navItems} userName={profile.full_name} roleLabel="Admin">
      {children}
    </PortalShell>
  );
}
