import { getPortalUser } from "@/lib/portal/get-user";
import { AddChildForm } from "@/components/portal/add-child-form";

export default async function ParentChildrenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, supabase } = await getPortalUser(locale);

  const { data: children } = await supabase
    .from("students")
    .select("id, date_of_birth, level, profiles(full_name)")
    .eq("parent_id", user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">My Children</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(children ?? []).map((c) => (
          <div key={c.id} className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-5 shadow-soft">
            <p className="font-semibold text-espresso-800">{c.profiles?.full_name}</p>
            <p className="text-sm text-espresso-400">{c.level ?? "Not yet assessed"}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <AddChildForm />
      </div>
    </div>
  );
}
