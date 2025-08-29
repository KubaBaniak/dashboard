"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LoadingSpinner } from "@/components/utils/Loader";

type CenteredSpinnerProps = {
  open?: boolean;
  text?: string;
  blur?: boolean;
  zIndex?: number;
};

export default function CenteredSpinner({
  open = true,
  text = "Loading…",
  blur = true,
  zIndex = 50,
}: CenteredSpinnerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 grid place-items-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={text}
    >
      <div
        className={`absolute inset-0 bg-background/60 ${blur ? "backdrop-blur-sm" : ""}`}
      />

      <div
        className="relative flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-5 shadow-lg"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <LoadingSpinner size={40} className="text-muted-foreground" />
        {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
