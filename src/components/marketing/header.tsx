"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "./locale-switcher";
import { Menu, X } from "lucide-react";

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/#programs", label: t("programs") },
    { href: "/#teachers", label: t("teachers") },
    { href: "/#faq", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-espresso-100/60 bg-cream-100/85 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-espresso-700 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-terracotta-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LocaleSwitcher className="flex gap-2 text-sm" />
          <Link href="/login" className="text-sm font-medium text-espresso-700 hover:text-terracotta-600">
            {t("login")}
          </Link>
          <Button href="/trial" size="sm">
            {t("bookTrial")}
          </Button>
        </div>

        <button
          className="rounded-full p-2 text-espresso-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-espresso-100/60 bg-cream-100 lg:hidden">
          <Container className="flex flex-col gap-4 py-5 text-sm font-medium text-espresso-700">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}>
              {t("login")}
            </Link>
            <div className="flex items-center justify-between pt-2">
              <LocaleSwitcher className="flex gap-3 text-sm" />
              <Button href="/trial" size="sm" onClick={() => setOpen(false)}>
                {t("bookTrial")}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
