import { Hero } from "@/components/marketing/sections/hero";
import { Problem } from "@/components/marketing/sections/problem";
import { Trust } from "@/components/marketing/sections/trust";
import { Audience } from "@/components/marketing/sections/audience";
import { HowItWorks } from "@/components/marketing/sections/how-it-works";
import { KidsExperience } from "@/components/marketing/sections/kids-experience";
import { Pricing } from "@/components/marketing/sections/pricing";
import { Teachers } from "@/components/marketing/sections/teachers";
import { Faq } from "@/components/marketing/sections/faq";
import { FinalCta } from "@/components/marketing/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Trust />
      <Audience />
      <HowItWorks />
      <KidsExperience />
      <Pricing />
      <Teachers />
      <Faq />
      <FinalCta />
    </>
  );
}
