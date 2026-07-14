import {
  FiltersSkeleton,
  ProductsGridSkeleton,
  Skeleton,
} from "../_components/Skeleton";

export default function Loading() {
  return (
    <section
      aria-label="Loading products"
      aria-busy="true"
      className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="space-y-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
          Curated picks
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Discover products</h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          Browse premium essentials with refined filtering and a seamless shopping experience.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6">
        <FiltersSkeleton />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-28" />
      </div>

      <ProductsGridSkeleton count={6} />
    </section>
  );
}
