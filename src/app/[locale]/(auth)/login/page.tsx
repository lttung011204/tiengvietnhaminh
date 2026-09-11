import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">{t("loginTitle")}</h1>
      <p className="mt-1 text-sm text-espresso-500">{t("loginSubtitle")}</p>
      <div className="mt-7">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-espresso-500">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-medium text-terracotta-600 hover:underline">
          {t("signupLink")}
        </Link>
      </p>
    </>
  );
}
