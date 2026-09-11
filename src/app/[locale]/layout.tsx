import type { Metadata } from "next";
import { Fraunces, Be_Vietnam_Pro } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "vietnamese"],
  axes: ["opsz", "SOFT", "WONK"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === "vi";
  const brand = "Tiếng Việt Nhà Mình";
  const title = isVi
    ? `${brand} — Học tiếng Việt online cho trẻ em xa quê`
    : `${brand} — Online Vietnamese Classes for Kids Abroad`;
  const description = isVi
    ? "Lớp học tiếng Việt trực tuyến 1 kèm 1 cho trẻ em và gia đình Việt Nam sống ở nước ngoài — ấm áp, bài bản, giúp con giữ gìn tiếng Việt và kết nối với gia đình."
    : "One-on-one online Vietnamese lessons for Vietnamese children and families living abroad — warm, structured lessons that help kids stay connected to language and family.";

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${brand}` },
    description,
    alternates: {
      languages: { vi: "/vi", en: "/en" },
    },
    openGraph: {
      title,
      description,
      images: ["/images/hero-banner.png"],
      locale: isVi ? "vi_VN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-banner.png"],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${fraunces.variable} ${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
