"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateLeadStatus } from "@/app/[locale]/(portal)/admin/leads/actions";
import type { LeadStatus } from "@/types/database";
import { clsx } from "clsx";

const STATUS_TONE: Record<LeadStatus, string> = {
  new: "bg-gold-100 text-gold-700",
  contacted: "bg-terracotta-100 text-terracotta-700",
  trial_scheduled: "bg-espresso-100 text-espresso-700",
  trial_completed: "bg-espresso-100 text-espresso-700",
  enrolled: "bg-green-100 text-green-700",
  not_enrolled: "bg-cream-200 text-espresso-400",
};

const STATUSES: LeadStatus[] = ["new", "contacted", "trial_scheduled", "trial_completed", "enrolled", "not_enrolled"];

export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const t = useTranslations("dashboard.admin.leadStatus");
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as LeadStatus;
        startTransition(() => {
          void updateLeadStatus(id, next);
        });
      }}
      className={clsx(
        "rounded-full border-0 px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-terracotta-400",
        STATUS_TONE[status],
      )}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {t(s)}
        </option>
      ))}
    </select>
  );
}
