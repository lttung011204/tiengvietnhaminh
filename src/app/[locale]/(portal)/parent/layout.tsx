import { getTranslations } from "next-intl/server";
import { getPortalUser } from "@/lib/portal/get-user";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { Home, Users, TrendingUp, MessageSquare, User } from "lucide-react";

export default async function ParentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile } = await getPortalUser(locale);
  const t = await getTranslations("dashboard.parent.nav");

  const navItems: PortalNavItem[] = [
    { href: "/parent", label: t("home"), icon: Home },
    { href: "/parent/children", label: t("myChildren"), icon: Users },
    { href: "/parent/progress", label: t("progress"), icon: TrendingUp },
    { href: "/parent/feedback", label: t("feedback"), icon: MessageSquare },
    { href: "/parent/profile", label: t("profile"), icon: User },
  ];

  return (
    <PortalShell navItems={navItems} userName={profile.full_name} roleLabel="Parent">
      {children}
    </PortalShell>
  );
}
