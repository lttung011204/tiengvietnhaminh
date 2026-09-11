import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Package = { lessons: number; price: string; priceUsd: string; tag: string; desc: string };

export function Pricing() {
  const t = useTranslations("programs");
  const packages = t.raw("packages") as Package[];

  return (
    <section id="programs" className="scroll-mt-24 bg-cream-50 py-20 sm:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-espresso-500">{t("subtitle")}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="inline-block rounded-full bg-terracotta-100 px-4 py-1.5 text-sm font-semibold text-terracotta-700">
              {t("unit")}
            </p>
            <p className="inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700">
              {t("unitUsd")}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {packages.map((pkg, i) => {
            const featured = i === 1;
            return (
              <Reveal key={pkg.lessons} delay={i * 0.08}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl border p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-soft-lg ${
                    featured
                      ? "border-terracotta-300 bg-cream-100 shadow-soft-lg md:-translate-y-3 md:hover:-translate-y-5"
                      : "border-espresso-100/70 bg-cream-100 hover:border-terracotta-200"
                  }`}
                >
                  {pkg.tag && (
                    <span
                      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold ${
                        featured ? "bg-terracotta-500 text-cream-50" : "bg-gold-200 text-espresso-800"
                      }`}
                    >
                      {pkg.tag}
                    </span>
                  )}
                  <p className="mt-2 font-display text-xl font-semibold text-espresso-900">
                    {t("packageLabel", { count: pkg.lessons })}
                  </p>
                  <p className="mt-3 font-display text-4xl font-bold text-terracotta-600">{pkg.price}</p>
                  <p className="mt-1 text-sm font-medium text-gold-700">{pkg.priceUsd}</p>
                  <p className="mt-1 text-sm text-espresso-400">{t("perLesson")}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-espresso-500">{pkg.desc}</p>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-espresso-600">
                    <Check size={16} className="text-terracotta-500" />
                    {t("perLessonDuration")}
                  </p>
                  <Button href="/trial" variant={featured ? "primary" : "secondary"} className="mt-6">
                    {t("cta")}
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-espresso-400">{t("note")}</p>
        <p className="mt-2 text-center text-xs text-espresso-300">{t("usdDisclaimer")}</p>
      </Container>
    </section>
  );
}
