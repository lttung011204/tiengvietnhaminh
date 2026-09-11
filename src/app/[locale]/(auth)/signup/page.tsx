import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  const t = useTranslations("auth");

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">{t("signupTitle")}</h1>
      <p className="mt-1 text-sm text-espresso-500">{t("signupSubtitle")}</p>
      <div className="mt-7">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-espresso-500">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-terracotta-600 hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </>
  );
}
