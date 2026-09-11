import { createClient } from "@/lib/supabase/server";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { Inbox } from "lucide-react";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("trial_leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">Trial Leads</h1>
      <p className="mt-1 text-sm text-espresso-500">Every trial-class registration from the public site.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-espresso-100/70 bg-cream-50 shadow-soft">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-espresso-100 text-xs text-espresso-400 uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Parent</th>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Level / Goal</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso-100">
            {leads?.map((lead) => (
              <tr key={lead.id}>
                <td className="px-5 py-4 whitespace-nowrap text-espresso-400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 font-medium text-espresso-800">{lead.parent_name}</td>
                <td className="px-5 py-4 text-espresso-700">
                  {lead.student_name}
                  {lead.student_age ? `, ${lead.student_age}y` : ""}
                </td>
                <td className="px-5 py-4 text-espresso-500">
                  <div>{lead.email}</div>
                  <div className="text-xs text-espresso-400">{lead.phone}</div>
                </td>
                <td className="px-5 py-4 text-espresso-500">
                  <div>{lead.vietnamese_level}</div>
                  <div className="max-w-[220px] truncate text-xs text-espresso-400">{lead.learning_goal}</div>
                </td>
                <td className="px-5 py-4">
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!leads?.length && (
          <div className="flex flex-col items-center gap-3 py-16 text-espresso-400">
            <Inbox size={28} />
            <p>No trial registrations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
