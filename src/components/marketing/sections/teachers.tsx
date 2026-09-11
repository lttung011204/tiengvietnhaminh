import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { GraduationCap, HeartHandshake, TrendingUp } from "lucide-react";

const ICONS = [GraduationCap, HeartHandshake, TrendingUp];

export function Teachers() {
  const t = useTranslations("teachers");
  const commitments = t.raw("commitments") as { title: string; desc: string }[];

  return (
    <section id="teachers" className="scroll-mt-24 py-20 sm:py-24">
      <Container className="max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-espresso-500">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {commitments.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-cream-50 p-7 shadow-soft">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-espresso-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-espresso-500">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
