import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export function Audience() {
  const t = useTranslations("audience");

  const cards = [
    { key: "kids", emoji: "🧒", tone: "from-terracotta-300 to-terracotta-500" },
    { key: "adults", emoji: "🌱", tone: "from-gold-300 to-gold-500" },
  ] as const;

  return (
    <section className="py-4 sm:py-6">
      <Container>
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.key} delay={i * 0.08}>
              <div className="relative overflow-hidden rounded-3xl bg-cream-50 p-8 shadow-soft">
                <div className={`absolute -top-10 -right-10 h-36 w-36 rounded-full bg-gradient-to-br ${card.tone} opacity-25 blur-2xl`} />
                <span className="text-4xl">{card.emoji}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-espresso-900">
                  {t(`${card.key}.title`)}
                </h3>
                <p className="mt-3 text-espresso-500">{t(`${card.key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
