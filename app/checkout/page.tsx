'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { loadOrders, type Order } from '@/lib/cart';
import { ArrowRight, CheckCircle2, PackageCheck, Truck } from 'lucide-react';
import { formatMoney, DEFAULT_CURRENCY } from '@/lib/currency';
import { CheckoutSkeleton } from '../_components/Skeleton';
import { useHydrated } from '../_components/useHydrated';

const statusStyles: Record<Order['status'], string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  'In Transit': 'bg-sky-50 text-sky-700 ring-sky-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const order = useMemo<Order | null>(
    () => (hydrated ? loadOrders()[0] ?? null : null),
    [hydrated],
  );

  if (!hydrated) {
    return (
      <section aria-label="Checkout" aria-busy="true" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <CheckoutSkeleton />
      </section>
    );
  }

  if (!order) {
    return (
      <section aria-label="Checkout" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Your order is being prepared</h1>
          <p className="mt-3 text-sm text-slate-600">No order details are available yet. Return to the cart and complete your purchase.</p>
          <Link href="/cart" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Back to cart <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Checkout" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Checkout complete</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Thank you for your order</h1>
            <p className="mt-2 text-sm text-slate-600">Your purchase has been received and is now being processed.</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${statusStyles[order.status]}`}>
            {order.status === 'Pending' && <PackageCheck className="mr-1 h-4 w-4" />}
            {order.status === 'In Transit' && <Truck className="mr-1 h-4 w-4" />}
            {order.status === 'Delivered' && <CheckCircle2 className="mr-1 h-4 w-4" />}
            {order.status}
          </span>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Order number</span>
            <span className="font-semibold text-slate-950">{order.id}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>Total</span>
            <span className="font-semibold text-slate-950">{formatMoney(order.total, order.currency ?? DEFAULT_CURRENCY)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/orders" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            View all orders
          </Link>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="cursor-pointer inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </section>
  );
}
