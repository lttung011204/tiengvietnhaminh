import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export function Audience() {
  const t = useTranslations("audience");

  return (
    <section className="py-4 sm:py-6">
      <Container>
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl bg-cream-50 shadow-soft">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="/images/kids-illustration.png"
                  alt={t("kids.title")}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl font-semibold text-espresso-900">{t("kids.title")}</h3>
                <p className="mt-3 text-espresso-500">{t("kids.desc")}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-3xl bg-cream-50 shadow-soft">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="/images/adults-illustration.png"
                  alt={t("adults.title")}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl font-semibold text-espresso-900">{t("adults.title")}</h3>
                <p className="mt-3 text-espresso-500">{t("adults.desc")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
