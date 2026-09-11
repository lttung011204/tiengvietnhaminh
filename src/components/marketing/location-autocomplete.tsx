"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { LOCATIONS } from "@/lib/data/locations";

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className: string;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return LOCATIONS.slice(0, 8);
    return LOCATIONS.filter((l) => l.search.split(" ").some((word) => word.startsWith(q))).slice(0, 8);
  }, [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (label: string) => {
    onChange(label);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlighted(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || options.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted((h) => Math.min(h + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            select(locale === "vi" ? options[highlighted].vi : options[highlighted].en);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open && options.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-espresso-100 bg-cream-50 p-1.5 shadow-soft-lg">
          {options.map((option, i) => {
            const label = locale === "vi" ? option.vi : option.en;
            return (
              <li key={label}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(label)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    i === highlighted ? "bg-terracotta-100 text-terracotta-700" : "text-espresso-700 hover:bg-cream-100"
                  }`}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
