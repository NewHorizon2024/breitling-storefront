"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useHydrated } from "./useHydrated";

const STORAGE_KEY = "breitling_announcement_dismissed";

function readDismissed(): boolean {
  try {
    return globalThis.localStorage?.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function AnnouncementBar() {
  const hydrated = useHydrated();
  const [dismissed, setDismissed] = useState(false);
  const storedDismissed = useMemo(
    () => (hydrated ? readDismissed() : false),
    [hydrated],
  );

  if (!hydrated || storedDismissed || dismissed) return null;

  function handleDismiss() {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore storage errors — dismissal still applies for this session
    }
    setDismissed(true);
  }

  return (
    <div className="relative bg-slate-950 text-white">
      <p className="mx-auto max-w-7xl px-10 py-2 text-center text-xs font-medium tracking-[0.14em] text-slate-200 sm:px-12">
        Complimentary express shipping · 2-year international warranty
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
