'use client';

import Link from 'next/link';
import { use, useMemo } from 'react';
import { loadOrders, type Order } from '@/lib/cart';
import { ArrowLeft, PackageCheck, Truck, CheckCircle2 } from 'lucide-react';
import { formatMoney, DEFAULT_CURRENCY } from '@/lib/currency';
import { Skeleton } from '../../_components/Skeleton';
import { useHydrated } from '../../_components/useHydrated';

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  'In Transit': 'bg-sky-50 text-sky-700 ring-sky-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
} as const;

// Orders live in localStorage (client-only), so this page resolves the order on
// the client after hydration rather than on the server.
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hydrated = useHydrated();
  const order = useMemo<Order | null>(
    () => (hydrated ? loadOrders().find((entry) => entry.id === id) ?? null : null),
    [hydrated, id],
  );

  const backLink = (
    <Link
      href="/orders"
      className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to orders
    </Link>
  );

  if (!hydrated) {
    return (
      <section aria-label="Order detail" aria-busy="true" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        {backLink}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-9 w-56" />
          <Skeleton className="mt-3 h-4 w-40" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section aria-label="Order detail" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        {backLink}
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
          <h1 className="text-xl font-semibold text-slate-900">We couldn’t find that order</h1>
          <p className="mt-2 text-sm">It may belong to a different device or browser. Your orders are shown on the orders page.</p>
          <Link href="/orders" className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
            View your orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Order detail" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      {backLink}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Order confirmed</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{order.id}</h1>
            <p className="mt-2 text-sm text-slate-600">Placed {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${statusStyles[order.status]}`}>
            {order.status === 'Pending' && <PackageCheck className="mr-1 h-4 w-4" aria-hidden="true" />}
            {order.status === 'In Transit' && <Truck className="mr-1 h-4 w-4" aria-hidden="true" />}
            {order.status === 'Delivered' && <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden="true" />}
            {order.status}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Items</h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.objectID}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatMoney(item.price * item.quantity, item.currency ?? order.currency ?? DEFAULT_CURRENCY)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Delivery status</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your order is now being prepared with priority handling. We’ll keep you updated as it moves through the shipping journey.
            </p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Total paid</span>
                <span className="font-semibold text-slate-950">{formatMoney(order.total, order.currency ?? DEFAULT_CURRENCY)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
