import { Hero } from "@/components/marketing/sections/hero";
import { Trust } from "@/components/marketing/sections/trust";
import { Audience } from "@/components/marketing/sections/audience";
import { HowItWorks } from "@/components/marketing/sections/how-it-works";
import { KidsExperience } from "@/components/marketing/sections/kids-experience";
import { Programs } from "@/components/marketing/sections/programs";
import { Teachers } from "@/components/marketing/sections/teachers";
import { Testimonials } from "@/components/marketing/sections/testimonials";
import { Faq } from "@/components/marketing/sections/faq";
import { FinalCta } from "@/components/marketing/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <Audience />
      <HowItWorks />
      <KidsExperience />
      <Programs />
      <Teachers />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
