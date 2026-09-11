"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, CheckCircle2, RotateCcw, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_CARDS = [
  { emoji: "🍎", vi: "Quả táo", en: "Apple" },
  { emoji: "🐟", vi: "Con cá", en: "Fish" },
  { emoji: "🌙", vi: "Mặt trăng", en: "Moon" },
  { emoji: "🐱", vi: "Con mèo", en: "Cat" },
  { emoji: "🌸", vi: "Bông hoa", en: "Flower" },
];

// Best-effort pick of a gentle-sounding Vietnamese female voice. The Web
// Speech API doesn't expose gender directly, so this matches on common
// Vietnamese female voice names (Windows/Edge, Chrome/Google, macOS/Safari)
// and otherwise falls back to any Vietnamese voice.
function pickVietnameseVoice(voices: SpeechSynthesisVoice[]) {
  const viVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith("vi"));
  if (!viVoices.length) return null;
  const femaleHint = /female|nữ|hoaimy|linh|mai|thao|huong/i;
  return viVoices.find((v) => femaleHint.test(v.name)) ?? viVoices[0];
}

export function FlashcardDemo() {
  const t = useTranslations("kidsExperience");
  const tLesson = useTranslations("lesson");
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const card = SAMPLE_CARDS[index];

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(card.vi);
      utterance.lang = "vi-VN";
      utterance.rate = 0.75;
      utterance.pitch = 1.2;

      const speakNow = () => {
        const voice = pickVietnameseVoice(synth.getVoices());
        if (voice) utterance.voice = voice;
        synth.cancel();
        synth.speak(utterance);
      };

      if (synth.getVoices().length === 0) {
        synth.addEventListener("voiceschanged", speakNow, { once: true });
      } else {
        speakNow();
      }
    } catch {
      // Speech synthesis isn't available — the card still works without audio.
    }
  };

  const advance = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => k + 1);
    if (index + 1 < SAMPLE_CARDS.length) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setKnown(0);
    setDone(false);
  };

  const progressLabel = useMemo(
    () => t("demoProgress", { current: Math.min(index + 1, SAMPLE_CARDS.length), total: SAMPLE_CARDS.length }),
    [index, t],
  );

  if (done) {
    return (
      <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-espresso-100 bg-cream-50 p-8 text-center shadow-soft-lg">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-600">
          <PartyPopper size={24} />
        </span>
        <p className="mt-4 font-display text-xl font-semibold text-espresso-900">
          {t("demoComplete", { count: SAMPLE_CARDS.length })}
        </p>
        <p className="mt-2 text-sm text-espresso-500">{t("demoCompleteDesc")}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/trial">{t("demoCta")}</Button>
          <Button variant="secondary" onClick={restart}>
            <RotateCcw size={16} className="mr-1.5 inline" />
            {t("demoRestart")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="mb-3 text-center text-sm font-medium text-espresso-400">{progressLabel}</p>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
        <div
          className="h-full rounded-full bg-terracotta-500 transition-all duration-300"
          style={{ width: `${(index / SAMPLE_CARDS.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.vi}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="rounded-[2rem] border border-espresso-100 bg-cream-50 p-8 text-center shadow-soft-lg"
        >
          <div className="text-7xl">{card.emoji}</div>
          <p className="mt-4 font-display text-3xl font-semibold text-espresso-900">{card.vi}</p>
          <p className="text-espresso-400">{card.en}</p>
          <button
            onClick={speak}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-2 text-sm font-medium text-terracotta-700 transition-colors hover:bg-terracotta-200"
          >
            <Volume2 size={16} />
            {t("card.listen")}
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => advance(false)}
          className="flex-1 rounded-2xl border-2 border-espresso-200 py-3.5 text-sm font-semibold text-espresso-600 transition-colors hover:border-espresso-300"
        >
          <RotateCcw className="mx-auto mb-1" size={18} />
          {tLesson("practiceAgain")}
        </button>
        <button
          onClick={() => advance(true)}
          className="flex-1 rounded-2xl bg-terracotta-500 py-3.5 text-sm font-semibold text-cream-50 shadow-soft transition-colors hover:bg-terracotta-600"
        >
          <CheckCircle2 className="mx-auto mb-1" size={18} />
          {tLesson("knowIt")}
        </button>
      </div>
    </div>
  );
}
