"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { submitTrialLead } from "@/app/[locale]/(marketing)/trial/actions";
import { Button } from "@/components/ui/button";

const schema = z.object({
  parentName: z.string().min(1),
  studentName: z.string().min(1),
  studentAge: z.string().optional(),
  country: z.string().optional(),
  vietnameseLevel: z.string().optional(),
  learningGoal: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  preferredContactMethod: z.string().optional(),
  preferredClassTime: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-2xl border border-espresso-100 bg-cream-50 px-4 py-3 text-espresso-800 placeholder:text-espresso-300 transition-colors focus:border-terracotta-400 focus:outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-espresso-700";

export function TrialForm() {
  const t = useTranslations("trialForm");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await submitTrialLead(values);
    if (result.ok) {
      router.push("/trial/thank-you");
    } else {
      setServerError(t("errorGeneric"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("fields.parentName")}</label>
          <input className={inputClass} {...register("parentName")} />
          {errors.parentName && <p className="mt-1 text-xs text-terracotta-600">{t("required")}</p>}
        </div>
        <div>
          <label className={labelClass}>{t("fields.studentName")}</label>
          <input className={inputClass} {...register("studentName")} />
          {errors.studentName && <p className="mt-1 text-xs text-terracotta-600">{t("required")}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("fields.studentAge")}</label>
          <input type="number" min={1} max={99} className={inputClass} {...register("studentAge")} />
        </div>
        <div>
          <label className={labelClass}>{t("fields.country")}</label>
          <input className={inputClass} placeholder={t("placeholders.country")} {...register("country")} />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t("fields.vietnameseLevel")}</label>
        <select className={inputClass} defaultValue="" {...register("vietnameseLevel")}>
          <option value="" disabled>
            —
          </option>
          <option value={t("levelOptions.none")}>{t("levelOptions.none")}</option>
          <option value={t("levelOptions.little")}>{t("levelOptions.little")}</option>
          <option value={t("levelOptions.conversational")}>{t("levelOptions.conversational")}</option>
          <option value={t("levelOptions.fluent")}>{t("levelOptions.fluent")}</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>{t("fields.learningGoal")}</label>
        <textarea
          className={inputClass}
          rows={3}
          placeholder={t("placeholders.learningGoal")}
          {...register("learningGoal")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("fields.phone")}</label>
          <input className={inputClass} {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-terracotta-600">{t("required")}</p>}
        </div>
        <div>
          <label className={labelClass}>{t("fields.email")}</label>
          <input type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-terracotta-600">{t("required")}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("fields.preferredContactMethod")}</label>
          <select className={inputClass} defaultValue="" {...register("preferredContactMethod")}>
            <option value="" disabled>
              —
            </option>
            <option value={t("contactOptions.phone")}>{t("contactOptions.phone")}</option>
            <option value={t("contactOptions.whatsapp")}>{t("contactOptions.whatsapp")}</option>
            <option value={t("contactOptions.email")}>{t("contactOptions.email")}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t("fields.preferredClassTime")}</label>
          <input
            className={inputClass}
            placeholder={t("placeholders.preferredClassTime")}
            {...register("preferredClassTime")}
          />
        </div>
      </div>

      {serverError && <p className="text-sm text-terracotta-600">{serverError}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
