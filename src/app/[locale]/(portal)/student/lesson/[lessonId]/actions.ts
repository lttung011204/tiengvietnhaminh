"use server";

import { createClient } from "@/lib/supabase/server";

export async function completeFlashcardLesson({
  lessonId,
  cardsKnown,
  cardsTotal,
  quizResponses,
}: {
  lessonId: string;
  cardsKnown: number;
  cardsTotal: number;
  quizResponses: { questionId: string; selectedOptionId: string | null; isCorrect: boolean }[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, score: 0 };

  const correctCount = quizResponses.filter((r) => r.isCorrect).length;
  const score = quizResponses.length ? Math.round((100 * correctCount) / quizResponses.length) : 100;

  if (quizResponses.length) {
    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .insert({ student_id: user.id, lesson_id: lessonId, score })
      .select("id")
      .single();

    if (attempt) {
      await supabase.from("quiz_responses").insert(
        quizResponses.map((r) => ({
          attempt_id: attempt.id,
          question_id: r.questionId,
          selected_option_id: r.selectedOptionId,
          is_correct: r.isCorrect,
        })),
      );
    }
  }

  await supabase.from("lesson_progress").upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      status: "completed",
      score,
      cards_known: cardsKnown,
      cards_total: cardsTotal,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_id" },
  );

  return { ok: true as const, score };
}

export async function markStructuredLessonComplete(lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const };

  await supabase.from("lesson_progress").upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      status: "completed",
      cards_known: 0,
      cards_total: 0,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_id" },
  );

  return { ok: true as const };
}
