import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

// Defense-in-depth: proxy.ts already redirects unauthenticated/wrong-role
// requests away from portal routes. This re-checks so a portal page never
// renders without a valid profile, even if reached some other way.
export async function getPortalUser(locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  if (!profile) {
    redirect({ href: "/login", locale });
  }

  return { user: user!, profile: profile as Profile, supabase };
}
