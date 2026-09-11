import { clsx } from "clsx";
import Image from "next/image";

// Official logo, placed at public/images/logo.png. Kept as its own
// component so a future logo update is a one-file change.
export function Logo({ className, wordmark = true }: { className?: string; wordmark?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 font-display font-semibold text-espresso-900", className)}>
      <Image src="/images/logo.png" alt="Tiếng Việt Nhà Mình" width={40} height={40} className="h-9 w-9 rounded-full sm:h-10 sm:w-10" priority />
      {wordmark && (
        <span className="leading-tight">
          Tiếng Việt
          <br className="hidden sm:block" /> Nhà Mình
        </span>
      )}
    </span>
  );
}
