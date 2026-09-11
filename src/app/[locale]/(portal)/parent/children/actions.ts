"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function addChild({
  fullName,
  email,
  password,
  dateOfBirth,
}: {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: "Not authenticated" };

  const { data: parent } = await supabase.from("parents").select("id").eq("id", user.id).maybeSingle();
  if (!parent) return { ok: false as const, error: "Only parent accounts can add a child" };

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "student", full_name: fullName, locale: "vi" },
  });

  if (createError || !created.user) {
    return { ok: false as const, error: createError?.message ?? "Could not create the child's account" };
  }

  // The DB trigger creates the `profiles` row; fill in the `students` subtype
  // row ourselves so we can set parent_id, audience, and date of birth.
  const { error: studentError } = await admin.from("students").upsert({
    id: created.user.id,
    parent_id: parent.id,
    audience: "kids",
    date_of_birth: dateOfBirth || null,
  } as never);

  if (studentError) {
    return { ok: false as const, error: studentError.message };
  }

  revalidatePath("/[locale]/parent/children", "page");
  return { ok: true as const };
}
