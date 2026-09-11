export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="absolute -bottom-1.5 left-0 h-3.5 w-full text-gold-400"
      >
        <path
          d="M2 9 Q 50 2 100 7 T 198 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
