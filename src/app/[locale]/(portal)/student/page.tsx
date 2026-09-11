import { getTranslations } from "next-intl/server";
import { getPortalUser } from "@/lib/portal/get-user";
import { getPrimaryEnrollment, getNextLesson } from "@/lib/portal/curriculum";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default async function StudentDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, profile, supabase } = await getPortalUser(locale);
  const t = await getTranslations("dashboard.student");

  const { data: student } = await supabase.from("students").select("*").eq("id", user.id).single();
  const primary = student ? await getPrimaryEnrollment(supabase, student.id) : null;
  const nextLesson = primary ? await getNextLesson(supabase, student!.id, primary.enrollment.course_id) : null;

  const isKid = student?.audience === "kids";
  const courseName: string | undefined = locale === "vi" ? primary?.enrollment.courses?.name_vi : primary?.enrollment.courses?.name_en;
  const percent = primary?.progress?.percent_complete ?? 0;

  if (!primary) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <Sparkles className="mx-auto text-gold-500" size={32} />
        <h1 className="mt-4 font-display text-2xl font-semibold text-espresso-900">
          {t("welcome")}, {profile.full_name}!
        </h1>
        <p className="mt-3 text-espresso-500">
          Your course hasn&apos;t been set up yet — our team will enroll you after your trial class.
        </p>
      </div>
    );
  }

  if (isKid) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-semibold text-espresso-900">
          {t("welcome")}, {profile.full_name}! 👋
        </h1>

        <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-terracotta-400 to-gold-300 p-1.5 shadow-soft-lg">
          <div className="rounded-[1.6rem] bg-cream-50 p-8">
            <p className="text-sm font-medium text-espresso-400">{t("todaysLesson")}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-espresso-900">
              {nextLesson ? (locale === "vi" ? nextLesson.name_vi : nextLesson.name_en) : "—"}
            </p>
            <div className="mx-auto mt-6 h-3 w-full overflow-hidden rounded-full bg-cream-200">
              <div className="h-full rounded-full bg-terracotta-500" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-sm text-espresso-400">{percent}% {t("progress").toLowerCase()}</p>
            {nextLesson && (
              <Button href={`/student/lesson/${nextLesson.id}`} size="lg" className="mt-7 w-full">
                {t("continueLesson")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">
        {t("welcome")}, {profile.full_name}
      </h1>

      <div className="mt-6 rounded-2xl border border-espresso-100/70 bg-cream-50 p-7 shadow-soft">
        <p className="text-sm font-medium text-espresso-400">{t("continueLearning")}</p>
        <p className="mt-1 font-display text-xl font-semibold text-espresso-900">{courseName}</p>
        <div className="mt-4 h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-cream-200">
          <div className="h-full rounded-full bg-terracotta-500" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-1.5 text-sm text-espresso-400">
          {t("progress")}: {percent}%
        </p>
        {nextLesson && (
          <Button href={`/student/lesson/${nextLesson.id}`} className="mt-6">
            {t("continueLesson")}
          </Button>
        )}
      </div>
    </div>
  );
}
