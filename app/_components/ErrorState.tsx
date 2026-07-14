"use client";

import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type ErrorStateProps = Readonly<{
  title?: string;
  description?: string;
  /** Retry handler — typically Next.js `unstable_retry` or `reset`. */
  onRetry?: () => void;
  /** Error digest shown as a small reference for support/log correlation. */
  digest?: string;
  /** Optional secondary action rendered next to the retry button. */
  secondaryAction?: ReactNode;
}>;

/**
 * On-brand fallback UI shared by the route `error.tsx` boundaries. Kept as a
 * presentational client component so each boundary is a thin wrapper.
 */
export default function ErrorState({
  title = "Something went wrong",
  description = "We hit an unexpected problem while loading this page. Please try again in a moment.",
  onRetry,
  digest,
  secondaryAction,
}: ErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100">
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
      </span>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        )}
        {secondaryAction ?? (
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
          >
            Back to products
          </Link>
        )}
      </div>

      {digest && (
        <p className="text-xs text-slate-400">Reference: {digest}</p>
      )}
    </div>
  );
}
