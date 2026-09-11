import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

const TEACHERS = [
  {
    name: "Cô Thảo Nguyên",
    emoji: "👩🏻‍🏫",
    years: 8,
    bio_vi: "Chuyên dạy tiếng Việt cho trẻ em ở nước ngoài, yêu thích lồng ghép văn hoá vào từng bài học.",
    bio_en: "Specializes in teaching Vietnamese to children abroad, loves weaving culture into every lesson.",
  },
  {
    name: "Thầy Đức Anh",
    emoji: "👨🏻‍🏫",
    years: 6,
    bio_vi: "Giáo viên ngữ pháp và hội thoại cho người lớn, kiên nhẫn và tận tâm với người mới bắt đầu.",
    bio_en: "Grammar and conversation teacher for adults, patient with complete beginners.",
  },
  {
    name: "Cô Bảo Trâm",
    emoji: "👩🏻‍🏫",
    years: 5,
    bio_vi: "Yêu trẻ nhỏ, giỏi biến bài học flashcard thành khoảnh khắc vui vẻ mỗi tuần.",
    bio_en: "Loves working with young kids, great at turning flashcard lessons into a weekly highlight.",
  },
];

export function Teachers() {
  const t = useTranslations("teachers");
  const locale = useLocale();

  return (
    <section id="teachers" className="scroll-mt-24 py-20 sm:py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-espresso-500">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TEACHERS.map((teacher, i) => (
            <Reveal key={teacher.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-cream-50 p-7 text-center shadow-soft">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-200 to-gold-200 text-4xl">
                  {teacher.emoji}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-espresso-900">{teacher.name}</h3>
                <p className="text-sm text-gold-600">
                  {teacher.years} {t("yearsExperience")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-espresso-500">
                  {locale === "vi" ? teacher.bio_vi : teacher.bio_en}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
