import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FlashcardLesson } from "@/components/portal/flashcard-lesson";
import { StructuredLesson } from "@/components/portal/structured-lesson";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; lessonId: string }>;
}) {
  const { locale, lessonId } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase.from("lessons").select("*").eq("id", lessonId).single();
  if (!lesson) notFound();

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*, quiz_options(*)")
    .eq("lesson_id", lessonId)
    .is("lesson_block_id", null)
    .order("sort_order");

  if (lesson.format === "flashcard") {
    const { data: cards } = await supabase
      .from("flashcards")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("sort_order");

    return (
      <FlashcardLesson
        lessonId={lessonId}
        cards={cards ?? []}
        questions={(questions ?? []).map((q) => ({ ...q, quiz_options: q.quiz_options ?? [] }))}
        locale={locale}
      />
    );
  }

  const { data: blocks } = await supabase
    .from("lesson_blocks")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("sort_order");

  return <StructuredLesson lessonId={lessonId} lessonName={locale === "vi" ? lesson.name_vi : lesson.name_en} blocks={blocks ?? []} locale={locale} />;
}
