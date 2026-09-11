"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={className}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === locale}
          className={
            loc === locale
              ? "font-semibold text-terracotta-600"
              : "text-espresso-400 hover:text-terracotta-600 transition-colors"
          }
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
