import { clsx } from "clsx";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-terracotta-500 text-cream-50 shadow-soft hover:bg-terracotta-600 hover:shadow-soft-lg hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-cream-50 text-espresso-800 border border-espresso-100 hover:border-terracotta-300 hover:text-terracotta-600",
  ghost: "text-espresso-700 hover:text-terracotta-600",
  gold: "bg-gold-400 text-espresso-900 shadow-soft hover:bg-gold-500 hover:-translate-y-0.5 active:translate-y-0",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base sm:text-lg",
};

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
} & (
  | ({ href: string } & ComponentPropsWithoutRef<typeof Link>)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

export function Button({ variant = "primary", size = "md", className, href, ...props }: ButtonProps) {
  const classes = clsx(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes} {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, "href">)} />
    );
  }

  return <button className={classes} {...(props as ComponentPropsWithoutRef<"button">)} />;
}
