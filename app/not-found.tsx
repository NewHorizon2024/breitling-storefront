import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section
      aria-label="Not found"
      className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 py-24 text-center sm:px-6 lg:px-8"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>

      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          404
        </p>
        <h1 className="text-3xl font-semibold text-slate-950">Page not found</h1>
        <p className="text-sm leading-6 text-slate-600">
          The page or product you’re looking for doesn’t exist or may have been moved.
        </p>
      </div>

      <Link
        href="/products"
        className="mt-1 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
      >
        Browse products
      </Link>
    </section>
  );
}
