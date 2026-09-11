"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { markStructuredLessonComplete } from "@/app/[locale]/(portal)/student/lesson/[lessonId]/actions";
import type { LessonBlock } from "@/types/database";
import { Volume2 } from "lucide-react";

const BLOCK_LABELS: Record<string, string> = {
  vocabulary: "Vocabulary",
  dialogue: "Dialogue",
  listening: "Listening",
  reading: "Reading",
  grammar: "Grammar",
  speaking_prompt: "Speaking practice",
  writing_exercise: "Writing exercise",
  quiz: "Quiz",
  teacher_assignment: "Teacher assignment",
};

function BlockBody({ block, locale }: { block: LessonBlock; locale: string }) {
  const content = block.content as Record<string, unknown>;
  const text = (locale === "vi" ? content.text_vi : content.text_en) as string | undefined;

  if (block.block_type === "vocabulary" && Array.isArray(content.items)) {
    const items = content.items as { word_vi: string; word_en?: string }[];
    return (
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl bg-cream-100 px-4 py-2.5">
            <span className="font-semibold text-espresso-800">{item.word_vi}</span>
            {item.word_en && <span className="ml-2 text-espresso-400">{item.word_en}</span>}
          </li>
        ))}
      </ul>
    );
  }

  if (block.block_type === "dialogue" && Array.isArray(content.lines)) {
    const lines = content.lines as { speaker: string; text_vi: string; text_en?: string }[];
    return (
      <div className="space-y-3">
        {lines.map((line, i) => (
          <p key={i}>
            <span className="font-semibold text-terracotta-600">{line.speaker}: </span>
            <span className="text-espresso-700">{locale === "vi" ? line.text_vi : line.text_en || line.text_vi}</span>
          </p>
        ))}
      </div>
    );
  }

  return <p className="leading-relaxed text-espresso-700">{text ?? "—"}</p>;
}

export function StructuredLesson({
  lessonId,
  lessonName,
  blocks,
  locale,
}: {
  lessonId: string;
  lessonName: string;
  blocks: LessonBlock[];
  locale: string;
}) {
  const t = useTranslations("lesson");
  const router = useRouter();
  const [done, setDone] = useState(false);

  const onComplete = async () => {
    await markStructuredLessonComplete(lessonId);
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-espresso-900">{t("lessonComplete")}</h2>
        <p className="mt-2 text-espresso-500">{t("lessonCompleteDesc")}</p>
        <Button onClick={() => router.push("/student")} className="mt-8">
          {t("backToDashboard")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold text-espresso-900">{lessonName}</h1>

      <div className="mt-6 space-y-5">
        {blocks.map((block) => (
          <div key={block.id} className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-gold-600 uppercase">
                {BLOCK_LABELS[block.block_type] ?? block.block_type}
              </span>
              {block.audio_url && (
                <button className="text-terracotta-600">
                  <Volume2 size={18} />
                </button>
              )}
            </div>
            {(block.title_vi || block.title_en) && (
              <h3 className="mt-2 font-display text-lg font-semibold text-espresso-900">
                {locale === "vi" ? block.title_vi : block.title_en || block.title_vi}
              </h3>
            )}
            <div className="mt-3">
              <BlockBody block={block} locale={locale} />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onComplete} size="lg" className="mt-8 w-full sm:w-auto">
        {t("lessonComplete")}
      </Button>
    </div>
  );
}
