import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Volume2 } from "lucide-react";

export function KidsExperience() {
  const t = useTranslations("kidsExperience");

  const sampleCards = [
    { emoji: "🍎", vi: "Quả táo", en: "Apple" },
    { emoji: "🐟", vi: "Con cá", en: "Fish" },
    { emoji: "🌙", vi: "Mặt trăng", en: "Moon" },
  ];

  return (
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-md text-lg text-espresso-500">{t("subtitle")}</p>
          <p className="mt-4 max-w-md text-sm text-espresso-400">{t("note")}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto flex max-w-sm items-center justify-center">
            {sampleCards.map((card, i) => (
              <div
                key={card.vi}
                className="absolute w-56 rounded-[2rem] border border-espresso-100 bg-cream-50 p-6 text-center shadow-soft-lg"
                style={{
                  transform: `rotate(${(i - 1) * 8}deg) translateX(${(i - 1) * 14}px)`,
                  zIndex: i === 1 ? 10 : 1,
                }}
              >
                <div className="text-6xl">{card.emoji}</div>
                <p className="mt-4 font-display text-2xl font-semibold text-espresso-900">{card.vi}</p>
                <p className="text-espresso-400">{card.en}</p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-2 text-sm font-medium text-terracotta-700">
                  <Volume2 size={16} />
                  {t("card.listen")}
                </button>
              </div>
            ))}
            <div className="invisible w-56 p-6">
              <div className="text-6xl">.</div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
