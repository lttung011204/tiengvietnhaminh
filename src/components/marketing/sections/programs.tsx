import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function Programs() {
  const t = useTranslations("programs");
  const levels = ["beginner", "elementary", "intermediate", "advanced"] as const;

  const cards = [
    { key: "kids", emoji: "🧒", titleKey: "audience.kids.title" },
    { key: "adults", emoji: "🧑", titleKey: "audience.adults.title" },
  ] as const;

  const tAudience = useTranslations("audience");

  return (
    <section id="programs" className="scroll-mt-24 bg-cream-50 py-20 sm:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-espresso-500">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.key} delay={i * 0.08}>
              <div className="rounded-3xl border border-espresso-100/70 bg-cream-100 p-8 shadow-soft">
                <span className="text-4xl">{card.emoji}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-espresso-900">
                  {tAudience(`${card.key}.title` as "kids.title" | "adults.title")}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <span
                      key={level}
                      className="rounded-full border border-terracotta-200 bg-terracotta-50 px-3 py-1 text-xs font-medium text-terracotta-700"
                    >
                      {t(`levels.${level}`)}
                    </span>
                  ))}
                </div>
                <Button href="/trial" variant="secondary" size="sm" className="mt-7">
                  {t("viewProgram")}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
