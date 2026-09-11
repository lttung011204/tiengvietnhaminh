import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

export default function TrialThankYouPage() {
  const t = useTranslations("trialThankYou");

  return (
    <section className="flex flex-1 items-center py-24">
      <Container className="max-w-xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600">
          <PartyPopper size={28} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h1>
        <p className="mt-4 text-lg text-espresso-500">{t("message")}</p>
        <Button href="/" variant="secondary" className="mt-9">
          {t("backHome")}
        </Button>
      </Container>
    </section>
  );
}
