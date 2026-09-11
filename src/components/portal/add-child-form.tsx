"use client";

import { useState } from "react";
import { addChild } from "@/app/[locale]/(portal)/parent/children/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

const inputClass =
  "w-full rounded-2xl border border-espresso-100 bg-cream-50 px-4 py-3 text-espresso-800 focus:border-terracotta-400 focus:outline-none";

export function AddChildForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Add a student profile</Button>;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await addChild({ fullName, email, password, dateOfBirth });
    setLoading(false);
    if (result.ok) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-2xl border border-espresso-100/70 bg-cream-50 p-6 shadow-soft">
      <p className="text-sm text-espresso-500">
        This creates a simple login your child can use to access their lessons.
      </p>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-espresso-700">Child&apos;s name</label>
        <input required className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-espresso-700">Date of birth</label>
        <input type="date" className={inputClass} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-espresso-700">Login email</label>
        <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-espresso-700">Login password</label>
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
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          Create profile
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
