import { getTranslations } from "next-intl/server";
import { getPortalUser } from "@/lib/portal/get-user";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { Home, BookOpen, ClipboardList, TrendingUp, User } from "lucide-react";

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile } = await getPortalUser(locale);
  const t = await getTranslations("dashboard.student.nav");

  const navItems: PortalNavItem[] = [
    { href: "/student", label: t("home"), icon: Home },
    { href: "/student/course", label: t("myCourse"), icon: BookOpen },
    { href: "/student/assignments", label: t("assignments"), icon: ClipboardList },
    { href: "/student/progress", label: t("progress"), icon: TrendingUp },
    { href: "/student/profile", label: t("profile"), icon: User },
  ];

  return (
    <PortalShell navItems={navItems} userName={profile.full_name} roleLabel="Student">
      {children}
    </PortalShell>
  );
}
