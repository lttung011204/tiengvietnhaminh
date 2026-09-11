import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export function Problem() {
  const t = useTranslations("problem");
  const items = t.raw("items") as string[];

  return (
    <section className="py-14 sm:py-16">
      <Container className="max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-espresso-900 sm:text-3xl">{t("title")}</h2>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mx-auto mt-8 max-w-lg space-y-4 text-left">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-espresso-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-8 font-display text-lg text-terracotta-600">{t("bridge")}</p>
        </Reveal>
      </Container>
    </section>
  );
}
