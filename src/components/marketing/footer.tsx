import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="mt-24 border-t border-espresso-100/60 bg-cream-50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-espresso-400">{t("tagline")}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-espresso-800">{t("quickLinks")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-espresso-400">
            <li>
              <Link href="/#programs" className="hover:text-terracotta-600">
                {nav("programs")}
              </Link>
            </li>
            <li>
              <Link href="/#teachers" className="hover:text-terracotta-600">
                {nav("teachers")}
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-terracotta-600">
                {nav("faq")}
              </Link>
            </li>
            <li>
              <Link href="/trial" className="hover:text-terracotta-600">
                {nav("bookTrial")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-espresso-800">{t("contact")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-espresso-400">
            <li>hello@tiengvietnhaminh.com</li>
            <li>WhatsApp / Zalo</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-espresso-100/60 py-6">
        <Container className="text-xs text-espresso-300">
          © {new Date().getFullYear()} {t("rights")}
        </Container>
      </div>
    </footer>
  );
}
