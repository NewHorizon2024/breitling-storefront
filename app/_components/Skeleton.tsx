import type { ComponentPropsWithoutRef } from "react";

type SkeletonProps = ComponentPropsWithoutRef<"div">;

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton rounded-md ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <Skeleton className="h-60 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center justify-between gap-3 pt-1">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul
      aria-hidden="true"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="list-none">
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-10 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-3/4" />
        <div className="space-y-2 pt-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </header>

      <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-28" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      <Skeleton className="h-12 w-40 rounded-full" />
    </article>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <ul className="space-y-3" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <li
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-40" />
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <Skeleton className="mt-6 h-11 w-full rounded-full" />
      </aside>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-full rounded-2xl" />
        ))}
      </div>
    </article>
  );
}

export function OrdersListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>

      <div className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Skeleton className="h-11 w-40 rounded-full" />
        <Skeleton className="h-11 w-44 rounded-full" />
      </div>
    </div>
  );
}
