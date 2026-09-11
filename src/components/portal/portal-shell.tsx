"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Link, usePathname } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/logo";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";

export type PortalNavItem = { href: string; label: string; icon: LucideIcon };

export function PortalShell({
  navItems,
  userName,
  roleLabel,
  children,
}: {
  navItems: PortalNavItem[];
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href as never}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-terracotta-500 text-cream-50" : "text-espresso-600 hover:bg-cream-200/70",
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="flex items-center justify-between border-b border-espresso-100/70 bg-cream-50 px-5 py-3 lg:hidden">
        <Logo className="text-base" />
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="p-2 text-espresso-800">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-espresso-100/70 bg-cream-50 px-5 py-7 lg:flex lg:min-h-screen">
          <Link href={"/" as never}>
            <Logo />
          </Link>
          {navLinks}
          <div className="mt-auto rounded-2xl bg-cream-200/60 p-4">
            <p className="text-sm font-semibold text-espresso-800">{userName}</p>
            <p className="text-xs text-espresso-400">{roleLabel}</p>
            <button
              onClick={logout}
              className="mt-3 flex items-center gap-2 text-sm font-medium text-terracotta-600 hover:underline"
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 bg-cream-50 px-5 py-6 lg:hidden">
            {navLinks}
            <div className="mt-6 border-t border-espresso-100 pt-6">
              <p className="text-sm font-semibold text-espresso-800">{userName}</p>
              <p className="text-xs text-espresso-400">{roleLabel}</p>
              <button
                onClick={logout}
                className="mt-3 flex items-center gap-2 text-sm font-medium text-terracotta-600 hover:underline"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
