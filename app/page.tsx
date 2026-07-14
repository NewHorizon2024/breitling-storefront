import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import FeaturedProducts from "./_components/FeaturedProducts";
import { ProductsGridSkeleton } from "./_components/Skeleton";

const valueProps = [
  {
    icon: Truck,
    title: "Complimentary express shipping",
    body: "Fast, tracked delivery on every order, always on us.",
  },
  {
    icon: ShieldCheck,
    title: "2-year international warranty",
    body: "Every timepiece is covered, wherever you are.",
  },
  {
    icon: RefreshCw,
    title: "30-day easy returns",
    body: "Changed your mind? Return it, no questions asked.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
              <Sparkles
                className="h-3.5 w-3.5 text-amber-300"
                aria-hidden="true"
              />
              The 2026 collection
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Precision, worn beautifully.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Discover a curated selection of premium timepieces and essentials
              — refined filtering, a seamless checkout, and a shopping
              experience built for the details.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Track your orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Why shop with us"
        className="border-b border-slate-200 bg-white"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
          {valueProps.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Featured products" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Handpicked
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                Featured products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8">
            <Suspense fallback={<ProductsGridSkeleton count={4} />}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-8 py-14 text-center text-white">
            <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
              Find the one that&rsquo;s unmistakably you.
            </h2>
            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              Browse the full catalog with smart filters and a checkout that
              stays out of your way.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
