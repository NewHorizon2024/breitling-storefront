'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { loadOrders, type Order } from '@/lib/cart';
import { PackageCheck, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatMoney, DEFAULT_CURRENCY } from '@/lib/currency';
import { OrdersListSkeleton } from '../_components/Skeleton';
import { useHydrated } from '../_components/useHydrated';

const statusStyles: Record<Order['status'], string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  'In Transit': 'bg-sky-50 text-sky-700 ring-sky-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export default function OrdersPage() {
  const hydrated = useHydrated();
  const orders = useMemo<Order[]>(
    () => (hydrated ? loadOrders() : []),
    [hydrated],
  );

  return (
    <section aria-label="Orders" className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Order history</p>
        <h1 className="text-3xl font-semibold text-slate-950">Your orders</h1>
        <p className="text-sm text-slate-600">A polished snapshot of your recent purchases and their progress.</p>
      </header>

      {!hydrated ? (
        <OrdersListSkeleton />
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          <p className="text-lg font-medium">No orders yet.</p>
          <p className="mt-2 text-sm">Complete a purchase to see it appear here with live-style tracking.</p>
          <Link href="/products" className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Continue shopping
          </Link>
        </div>
      ) : (
        <ul className="grid list-none gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                aria-label={`View order ${order.id}, ${order.items.length} item${order.items.length === 1 ? '' : 's'}, ${order.status}, total ${formatMoney(order.total, order.currency ?? DEFAULT_CURRENCY)}`}
                className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{order.id}</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-950">{order.items.length} item{order.items.length === 1 ? '' : 's'}</h2>
                    <p className="mt-1 text-sm text-slate-600">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${statusStyles[order.status]}`}>
                      {order.status === 'Pending' && <PackageCheck className="mr-1 h-4 w-4" aria-hidden="true" />}
                      {order.status === 'In Transit' && <Truck className="mr-1 h-4 w-4" aria-hidden="true" />}
                      {order.status === 'Delivered' && <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden="true" />}
                      {order.status}
                    </span>
                    <p className="text-lg font-semibold text-slate-950">{formatMoney(order.total, order.currency ?? DEFAULT_CURRENCY)}</p>
                    <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600" aria-hidden="true" />
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.objectID}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatMoney(item.price * item.quantity, item.currency ?? order.currency ?? DEFAULT_CURRENCY)}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
