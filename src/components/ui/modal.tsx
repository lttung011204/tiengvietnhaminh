"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Note: framer-motion's AnimatePresence does not correctly run exit
// animations / cleanup in this React 19 + Next 16 setup, so this handles
// entry/exit with a plain CSS transition instead.
export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  if (open && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const hide = requestAnimationFrame(() => setVisible(false));
    const unmount = setTimeout(() => setMounted(false), 200);
    return () => {
      cancelAnimationFrame(hide);
      clearTimeout(unmount);
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined" || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="absolute inset-0 bg-espresso-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-cream-50 p-7 shadow-soft-lg transition-all duration-200 sm:p-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-espresso-500 transition-colors hover:bg-cream-200 hover:text-espresso-800"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
