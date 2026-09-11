"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitAssignmentResponse(assignmentId: string, responseText: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const };

  const { error } = await supabase.from("assignment_submissions").upsert(
    {
      assignment_id: assignmentId,
      student_id: user.id,
      status: "submitted",
      response_text: responseText,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "assignment_id,student_id" },
  );

  if (error) return { ok: false as const };

  revalidatePath("/[locale]/student/assignments", "page");
  return { ok: true as const };
}
