import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Tiếng Việt Nhà Mình",
  description: "Online, one-on-one Vietnamese lessons for Vietnamese children and families living abroad.",
  logo: "/images/logo.png",
  sameAs: ["https://www.facebook.com/tiengvietnhaminh/"],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
