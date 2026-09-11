"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, CheckCircle2, RotateCcw, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { completeFlashcardLesson } from "@/app/[locale]/(portal)/student/lesson/[lessonId]/actions";
import type { Flashcard, QuizOption, QuizQuestion } from "@/types/database";

type QuestionWithOptions = QuizQuestion & { quiz_options: QuizOption[] };

export function FlashcardLesson({
  lessonId,
  cards,
  questions,
  locale,
}: {
  lessonId: string;
  cards: Flashcard[];
  questions: QuestionWithOptions[];
  locale: string;
}) {
  const t = useTranslations("lesson");
  const router = useRouter();

  const [phase, setPhase] = useState<"cards" | "review" | "complete">(cards.length ? "cards" : "review");
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [responses, setResponses] = useState<
    { questionId: string; selectedOptionId: string | null; isCorrect: boolean }[]
  >([]);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const card = cards[index];
  const question = questions[qIndex];

  const playAudio = (url: string | null) => {
    if (!url) return;
    new Audio(url).play().catch(() => {});
  };

  const handleCardDecision = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => k + 1);
    if (index + 1 < cards.length) {
      setIndex((i) => i + 1);
    } else {
      setPhase(questions.length ? "review" : "complete");
    }
  };

  const handleAnswer = async (optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    const isCorrect = question.quiz_options.find((o) => o.id === optionId)?.is_correct ?? false;
    const nextResponses = [...responses, { questionId: question.id, selectedOptionId: optionId, isCorrect }];
    setResponses(nextResponses);

    setTimeout(async () => {
      if (qIndex + 1 < questions.length) {
        setQIndex((i) => i + 1);
        setSelected(null);
      } else {
        setSaving(true);
        const result = await completeFlashcardLesson({
          lessonId,
          cardsKnown: known,
          cardsTotal: cards.length,
          quizResponses: nextResponses,
        });
        setScore(result.score);
        setSaving(false);
        setPhase("complete");
      }
    }, 700);
  };

  const cardsProgressLabel = useMemo(
    () => t("cardsProgress", { current: Math.min(index + 1, cards.length), total: cards.length }),
    [index, cards.length, t],
  );

  if (phase === "cards" && card) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-10 text-center">
        <p className="mb-6 text-sm font-medium text-espresso-400">{cardsProgressLabel}</p>
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-terracotta-500 transition-all duration-300"
            style={{ width: `${(index / cards.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full rounded-[2.5rem] border border-espresso-100 bg-cream-50 p-10 shadow-soft-lg"
          >
            {card.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.image_url} alt={card.word_vi} className="mx-auto h-40 w-40 rounded-3xl object-cover" />
            ) : (
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl bg-cream-200 text-6xl">
                🖼️
              </div>
            )}
            <p className="mt-6 font-display text-4xl font-semibold text-espresso-900">{card.word_vi}</p>
            {card.word_en && <p className="mt-1 text-xl text-espresso-400">{card.word_en}</p>}
            {card.example_sentence_vi && (
              <p className="mt-4 text-sm text-espresso-500 italic">{card.example_sentence_vi}</p>
            )}
            <button
              onClick={() => playAudio(card.audio_url)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-5 py-2.5 text-sm font-medium text-terracotta-700"
            >
              <Volume2 size={18} />
              {t("replay")}
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex w-full gap-4">
          <button
            onClick={() => handleCardDecision(false)}
            className="flex-1 rounded-2xl border-2 border-espresso-200 py-5 text-lg font-semibold text-espresso-600 transition-colors hover:border-espresso-300"
          >
            <RotateCcw className="mx-auto mb-1" size={22} />
            {t("practiceAgain")}
          </button>
          <button
            onClick={() => handleCardDecision(true)}
            className="flex-1 rounded-2xl bg-terracotta-500 py-5 text-lg font-semibold text-cream-50 shadow-soft transition-colors hover:bg-terracotta-600"
          >
            <CheckCircle2 className="mx-auto mb-1" size={22} />
            {t("knowIt")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "review" && question) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <p className="mb-2 text-sm font-medium text-gold-600">{t("reviewTitle")}</p>
        <p className="mb-6 text-sm text-espresso-400">
          {qIndex + 1} / {questions.length}
        </p>

        <div className="rounded-[2rem] border border-espresso-100 bg-cream-50 p-8 shadow-soft-lg">
          {question.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={question.image_url} alt="" className="mx-auto mb-4 h-28 w-28 rounded-2xl object-cover" />
          )}
          <p className="font-display text-xl font-semibold text-espresso-900">
            {locale === "vi" ? question.prompt_vi : question.prompt_en || question.prompt_vi}
          </p>
          {question.audio_url && (
            <button
              onClick={() => playAudio(question.audio_url)}
              className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-2 text-sm font-medium text-terracotta-700"
            >
              <Volume2 size={16} />
              {t("replay")}
            </button>
          )}

          <div className="mt-6 grid gap-3">
            {question.quiz_options.map((option) => {
              const isSelected = selected === option.id;
              const isCorrectOption = option.is_correct;
              const showState = selected !== null;
              return (
                <button
                  key={option.id}
                  disabled={selected !== null}
                  onClick={() => handleAnswer(option.id)}
                  className={`rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors ${
                    showState && isCorrectOption
                      ? "border-green-400 bg-green-50 text-green-700"
                      : showState && isSelected
                        ? "border-terracotta-400 bg-terracotta-50 text-terracotta-700"
                        : "border-espresso-100 text-espresso-700 hover:border-terracotta-300"
                  }`}
                >
                  {locale === "vi" ? option.label_vi : option.label_en || option.label_vi}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600">
        <PartyPopper size={28} />
      </span>
      <h2 className="mt-6 font-display text-2xl font-semibold text-espresso-900">{t("lessonComplete")}</h2>
      <p className="mt-2 text-espresso-500">{t("lessonCompleteDesc")}</p>
      {questions.length > 0 && (
        <p className="mt-4 text-lg font-semibold text-terracotta-600">
          {t("yourScore")}: {saving ? "…" : `${score}%`}
        </p>
      )}
      <Button onClick={() => router.push("/student")} className="mt-8">
        {t("backToDashboard")}
      </Button>
    </div>
  );
}
