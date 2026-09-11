"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

const inputClass =
  "w-full rounded-2xl border border-espresso-100 bg-cream-50 px-4 py-3 text-espresso-800 focus:border-terracotta-400 focus:outline-none";

export function SignupForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [accountType, setAccountType] = useState<"parent" | "student">("parent");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: accountType, full_name: fullName, locale } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (accountType === "student" && data.user) {
      await supabase.from("students").insert({ id: data.user.id, audience: "adults" } as never);
    }

    if (data.session) {
      router.push((`/${accountType}` as never));
      router.refresh();
    } else {
      setCheckEmail(true);
    }
    setLoading(false);
  };

  if (checkEmail) {
    return <p className="text-espresso-700">Please check your email to confirm your account, then log in.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex rounded-2xl bg-cream-100 p-1 text-sm font-medium">
        {(["parent", "student"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setAccountType(type)}
            className={clsx(
              "flex-1 rounded-xl py-2 transition-colors",
              accountType === type ? "bg-cream-50 text-terracotta-600 shadow-soft" : "text-espresso-400",
            )}
          >
            {type === "parent" ? "Parent" : "Adult learner"}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-espresso-700">{t("fullName")}</label>
        <input required className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-espresso-700">{t("email")}</label>
        <input
          type="email"
          required
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-espresso-700">{t("password")}</label>
        <input
          type="password"
          required
          minLength={6}
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-terracotta-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {t("signupSubmit")}
      </Button>
    </form>
  );
}
