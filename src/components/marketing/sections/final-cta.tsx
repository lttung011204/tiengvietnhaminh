import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-terracotta-500 to-terracotta-700 px-8 py-16 text-center sm:px-16">
            <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-gold-300/30 blur-3xl" />
            <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">{t("title")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-terracotta-100">{t("subtitle")}</p>
            <Button href="/trial" size="lg" variant="gold" className="mt-8">
              {t("cta")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
