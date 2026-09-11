import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as { title: string; desc: string }[];

  return (
    <section className="bg-cream-50 py-20 sm:py-24">
      <Container>
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08} className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-500 font-display text-lg font-semibold text-cream-50">
                {i + 1}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-espresso-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-espresso-500">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-[calc(100%_-_0.5rem)] hidden h-px w-8 bg-terracotta-200 lg:block" />
              )}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
