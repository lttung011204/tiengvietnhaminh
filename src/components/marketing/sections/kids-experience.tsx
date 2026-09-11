import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Volume2, Image as ImageIcon, Repeat } from "lucide-react";
import { FlashcardDemo } from "@/components/marketing/flashcard-demo";

const BADGE_ICONS = [ImageIcon, Volume2, Repeat];

const REAL_LESSON_SAMPLES = [
  { src: "/images/flashcards/letter-a.png", alt: "Flashcard chữ A" },
  { src: "/images/flashcards/letter-b.png", alt: "Flashcard chữ B" },
  { src: "/images/flashcards/letter-c.png", alt: "Flashcard chữ C" },
  { src: "/images/flashcards/tone-marks.png", alt: "Flashcard dấu thanh" },
];

export function KidsExperience() {
  const t = useTranslations("kidsExperience");
  const badges = t.raw("badges") as string[];

  return (
    <section className="py-20 sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-md text-lg text-espresso-500">{t("subtitle")}</p>
          <p className="mt-4 max-w-md text-sm text-espresso-400">{t("note")}</p>
          <p className="mt-5 font-display text-lg text-terracotta-600">{t("tryIt")}</p>

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
          <FlashcardDemo />
        </Reveal>
      </Container>

      <Container className="mt-16">
        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {REAL_LESSON_SAMPLES.map((sample) => (
              <div
                key={sample.src}
                className="overflow-hidden rounded-2xl border border-espresso-100 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <Image
                  src={sample.src}
                  alt={sample.alt}
                  width={280}
                  height={350}
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
