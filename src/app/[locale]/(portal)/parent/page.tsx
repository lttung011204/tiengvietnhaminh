import { getTranslations } from "next-intl/server";
import { getPortalUser } from "@/lib/portal/get-user";
import { getChildrenOverview } from "@/lib/portal/parent";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default async function ParentDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, profile, supabase } = await getPortalUser(locale);
  const t = await getTranslations("dashboard.parent");

  const children = await getChildrenOverview(supabase, user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-espresso-900">
        {t.raw("nav").home}, {profile.full_name}
      </h1>

      {!children.length ? (
        <div className="mt-8 rounded-2xl border border-dashed border-espresso-200 bg-cream-50 p-10 text-center">
          <Users className="mx-auto text-espresso-300" size={28} />
          <p className="mt-3 text-espresso-500">{t("noChildren")}</p>
          <Button href="/parent/children" className="mt-5">
            {t("addChild")}
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {children.map(({ student, primary, feedback, lessonsThisWeek, wordsThisWeek }) => {
            const childName = student.profiles?.full_name ?? "Student";
            const courseName = locale === "vi" ? primary?.enrollment.courses?.name_vi : primary?.enrollment.courses?.name_en;
            const teacherName = feedback?.teachers?.profiles?.full_name;

            return (
              <div key={student.id} className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold text-espresso-900">{childName}</h3>
                <p className="text-sm text-espresso-500">{courseName ?? "No course assigned yet"}</p>

                {primary && (
                  <>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-cream-200">
                      <div
                        className="h-full rounded-full bg-terracotta-500"
                        style={{ width: `${primary.progress?.percent_complete ?? 0}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-espresso-400">
                      {t("progress")}: {primary.progress?.percent_complete ?? 0}%
                    </p>
                  </>
                )}

                <div className="mt-4 rounded-xl bg-cream-100 p-4 text-sm text-espresso-600">
                  <p className="font-medium text-espresso-700">{t("thisWeek")}</p>
                  <p className="mt-1">
                    ✓ {lessonsThisWeek} {t("lessonsCompleted")}
                  </p>
                  <p>
                    ✓ {wordsThisWeek} {t("wordsLearned")}
                  </p>
                </div>

                {feedback && (
                  <div className="mt-4 border-t border-espresso-100 pt-4">
                    <p className="text-xs font-semibold text-gold-600 uppercase">{t("teacherNote")}</p>
                    <p className="mt-1 text-sm text-espresso-600 italic">
                      &ldquo;{locale === "vi" ? feedback.note_vi : feedback.note_en || feedback.note_vi}&rdquo;
                    </p>
                    {teacherName && <p className="mt-1 text-xs text-espresso-400">— {teacherName}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
