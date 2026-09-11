import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { TrialForm } from "@/components/marketing/trial-form";

export default function TrialPage() {
  const t = useTranslations("trialForm");

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-espresso-500">{t("subtitle")}</p>

        <div className="mt-10 rounded-3xl border border-espresso-100/70 bg-cream-50 p-6 shadow-soft sm:p-10">
          <TrialForm />
        </div>
      </Container>
    </section>
  );
}
