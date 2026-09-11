import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-100 px-5 py-16">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md rounded-3xl border border-espresso-100/70 bg-cream-50 p-8 shadow-soft-lg sm:p-10">
        {children}
      </div>
    </div>
  );
}
