import { getPortalUser } from "@/lib/portal/get-user";

export default async function StudentProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, profile, supabase } = await getPortalUser(locale);
  const { data: student } = await supabase.from("students").select("*").eq("id", user.id).single();

  const rows = [
    ["Full name", profile.full_name],
    ["Email", user.email ?? "—"],
    ["Audience", student?.audience ?? "—"],
    ["Level", student?.level ?? "Not yet assessed"],
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">My Profile</h1>
      <div className="mt-6 max-w-md divide-y divide-espresso-100 rounded-2xl border border-espresso-100/70 bg-cream-50 shadow-soft">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-espresso-400">{label}</span>
            <span className="font-medium text-espresso-800 capitalize">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
