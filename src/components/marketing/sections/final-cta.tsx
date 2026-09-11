import Image from "next/image";
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
          <div className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center sm:px-16">
            <Image
              src="/images/scene-bike-hanoi.png"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta-700/90 via-terracotta-600/85 to-terracotta-800/90" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">{t("title")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-terracotta-100">{t("subtitle")}</p>
              <Button href="/trial" size="lg" variant="gold" className="mt-8">
                {t("cta")}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
