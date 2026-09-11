"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type AudienceKey = "kids" | "adults";

const CARDS: { key: AudienceKey; image: string }[] = [
  { key: "kids", image: "/images/kids-illustration.png" },
  { key: "adults", image: "/images/adults-illustration.png" },
];

export function Audience() {
  const t = useTranslations("audience");
  const [open, setOpen] = useState<AudienceKey | null>(null);
  const levels = t.raw("levels") as string[];

  const active = CARDS.find((c) => c.key === open);

  return (
    <section className="py-4 sm:py-6">
      <Container>
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CARDS.map((card, i) => (
            <Reveal key={card.key} delay={i * 0.08}>
              <motion.button
                type="button"
                onClick={() => setOpen(card.key)}
                whileHover={{ y: -6 }}
                whileTap={{ y: -2 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="group block w-full overflow-hidden rounded-3xl bg-cream-50 text-left shadow-soft transition-shadow duration-300 hover:shadow-soft-lg"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={t(`${card.key}.title`)}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-display text-2xl font-semibold text-espresso-900">{t(`${card.key}.title`)}</h3>
                  <p className="mt-3 text-espresso-500">{t(`${card.key}.desc`)}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600">
                    {t("viewDetail")}
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </Container>

      <Modal open={open !== null} onClose={() => setOpen(null)}>
        {active && (
          <>
            <div className="relative -mx-7 -mt-7 h-48 w-[calc(100%+3.5rem)] overflow-hidden rounded-t-[2rem] sm:-mx-8 sm:-mt-8 sm:w-[calc(100%+4rem)]">
              <Image src={active.image} alt={t(`${active.key}.title`)} fill className="object-cover object-top" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold text-espresso-900">{t(`${active.key}.title`)}</h3>
            <p className="mt-2 text-espresso-500">{t(`${active.key}.desc`)}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {levels.map((level) => (
                <span
                  key={level}
                  className="rounded-full border border-terracotta-200 bg-terracotta-50 px-3 py-1 text-xs font-medium text-terracotta-700"
                >
                  {level}
                </span>
              ))}
            </div>

            <ul className="mt-6 space-y-3">
              {(t.raw(`${active.key}.highlights`) as string[]).map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-espresso-600">
                  <Check size={16} className="mt-0.5 shrink-0 text-terracotta-500" />
                  {line}
                </li>
              ))}
            </ul>

            <Button href="/trial" className="mt-7 w-full sm:w-auto">
              {t("cta")}
            </Button>
          </>
        )}
      </Modal>
    </section>
  );
}
