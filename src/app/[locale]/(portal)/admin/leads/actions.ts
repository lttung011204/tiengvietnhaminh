"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types/database";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("trial_leads").update({ status }).eq("id", id);

  if (error) {
    console.error("updateLeadStatus:", error.message);
    return { ok: false as const };
  }

  revalidatePath("/[locale]/admin/leads", "page");
  return { ok: true as const };
}
