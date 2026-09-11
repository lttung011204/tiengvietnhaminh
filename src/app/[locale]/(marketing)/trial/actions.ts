"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const trialLeadSchema = z.object({
  parentName: z.string().trim().min(1),
  studentName: z.string().trim().min(1),
  studentAge: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  country: z.string().trim().optional(),
  vietnameseLevel: z.string().trim().optional(),
  learningGoal: z.string().trim().optional(),
  phone: z.string().trim().min(1),
  email: z.string().trim().email(),
  preferredContactMethod: z.string().trim().optional(),
  preferredClassTime: z.string().trim().optional(),
});

export type TrialLeadInput = z.input<typeof trialLeadSchema>;

export async function submitTrialLead(input: TrialLeadInput) {
  const parsed = trialLeadSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false as const, error: "invalid" };
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { error } = await supabase.from("trial_leads").insert({
    parent_name: data.parentName,
    student_name: data.studentName,
    student_age: data.studentAge ?? null,
    phone: data.phone,
    email: data.email,
    country: data.country || null,
    vietnamese_level: data.vietnameseLevel || null,
    learning_goal: data.learningGoal || null,
    preferred_contact_method: data.preferredContactMethod || null,
    preferred_class_time: data.preferredClassTime || null,
  });

  if (error) {
    console.error("submitTrialLead:", error.message);
    return { ok: false as const, error: "server" };
  }

  return { ok: true as const };
}
