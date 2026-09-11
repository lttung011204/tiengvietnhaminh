import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Volume2, Image as ImageIcon, Repeat } from "lucide-react";

const BADGE_ICONS = [ImageIcon, Volume2, Repeat];

const SAMPLE_FLASHCARDS = [
  { src: "/images/flashcards/tone-marks.png", alt: "Flashcard dấu thanh tiếng Việt", rotate: -8, x: -14 },
  { src: "/images/flashcards/letter-a.png", alt: "Flashcard chữ A", rotate: 0, x: 0 },
  { src: "/images/flashcards/letter-c.png", alt: "Flashcard chữ C", rotate: 8, x: 14 },
];

export function KidsExperience() {
  const t = useTranslations("kidsExperience");
  const badges = t.raw("badges") as string[];

  return (
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-md text-lg text-espresso-500">{t("subtitle")}</p>
          <p className="mt-4 max-w-md text-sm text-espresso-400">{t("note")}</p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {badges.map((label, i) => {
              const Icon = BADGE_ICONS[i % BADGE_ICONS.length];
              return (
                <span key={label} className="inline-flex items-center gap-2 text-sm font-medium text-espresso-600">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600">
                    <Icon size={14} />
                  </span>
                  {label}
                </span>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto flex h-[340px] max-w-sm items-center justify-center sm:h-[380px]">
            {SAMPLE_FLASHCARDS.map((card, i) => (
              <div
                key={card.src}
                className="absolute w-56 overflow-hidden rounded-[1.75rem] border border-espresso-100 bg-cream-50 shadow-soft-lg transition-transform duration-300 hover:-translate-y-1 sm:w-64"
                style={{
                  transform: `rotate(${card.rotate}deg) translateX(${card.x}px)`,
                  zIndex: i === 1 ? 10 : 1,
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={560}
                  height={700}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
