import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Heart, Users, Sparkles, BookHeart, GraduationCap } from "lucide-react";

const icons = [Heart, Users, Sparkles, BookHeart, GraduationCap];

export function Trust() {
  const t = useTranslations("trust");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-espresso-500">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-espresso-100/70 bg-cream-50 p-7 shadow-soft transition-transform hover:-translate-y-1">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-espresso-900">{item.title}</h3>
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
