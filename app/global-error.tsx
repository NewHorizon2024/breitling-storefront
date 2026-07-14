"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import "./globals.css";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>;

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // global-error replaces the root layout, so it must render its own html/body.
    <html lang="en">
      <body>
        <title>Something went wrong — Breitling Storefront</title>
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="flex max-w-2xl flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100">
              <TriangleAlert className="h-7 w-7" aria-hidden="true" />
            </span>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-950">
                Something went wrong
              </h1>
              <p className="text-sm leading-6 text-slate-600">
                The application ran into an unexpected problem. Please try
                again.
              </p>
            </div>
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            {error.digest && (
              <p className="text-xs text-slate-400">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
