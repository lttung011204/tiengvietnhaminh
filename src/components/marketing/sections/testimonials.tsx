import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Quote } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as { quote: string; name: string; context: string }[];

  return (
    <section className="bg-cream-50 py-20 sm:py-24">
      <Container>
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-espresso-900 sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-cream-100 p-7 shadow-soft">
                <Quote className="text-gold-500" size={26} />
                <p className="mt-4 text-espresso-700 italic leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <p className="mt-5 font-semibold text-espresso-900">{item.name}</p>
                <p className="text-sm text-espresso-400">{item.context}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
