"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/marketing/highlight";
import { Sparkles, HeartHandshake } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  const tTrial = useTranslations("trialForm");

  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-32 h-72 w-72 rounded-full bg-terracotta-200/40 blur-3xl"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center rounded-full bg-terracotta-100 px-4 py-1.5 text-sm font-medium text-terracotta-700">
            {t("eyebrow")}
          </span>
          <h1 className="mt-6 font-display text-4xl leading-tight font-semibold text-balance text-espresso-900 sm:text-5xl lg:text-[3.25rem]">
            {t.rich("title", { highlight: (chunks) => <Highlight>{chunks}</Highlight> })}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-espresso-600">{t("subtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/trial" size="lg">
              {t("ctaPrimary")}
            </Button>
            <Button href="/#programs" size="lg" variant="secondary">
              {t("ctaSecondary")}
            </Button>
          </div>
          <p className="mt-5 text-sm text-espresso-400">{tTrial("trustNote")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="aspect-[4/5] w-full rounded-[2.5rem] bg-gradient-to-br from-terracotta-300 via-terracotta-400 to-gold-300 p-2 shadow-soft-lg">
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-[2rem] bg-cream-50/90 text-center">
              <Image
                src="/images/logo.png"
                alt="Tiếng Việt Nhà Mình"
                width={280}
                height={280}
                className="h-48 w-48 rounded-full shadow-soft sm:h-56 sm:w-56"
                priority
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 flex items-center gap-2.5 rounded-2xl bg-cream-50 px-5 py-4 shadow-soft-lg">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600">
              <Sparkles size={17} />
            </span>
            <p className="text-sm font-semibold text-espresso-800">{t("badge1")}</p>
          </div>
          <div className="absolute -top-5 -right-5 hidden items-center gap-2.5 rounded-2xl bg-cream-50 px-5 py-4 shadow-soft-lg sm:flex">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
              <HeartHandshake size={17} />
            </span>
            <p className="text-sm font-semibold text-espresso-800">{t("badge2")}</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
