"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "../../lib/analytics";
import { useCart } from "../_components/CartContext";
import toast from "react-hot-toast";
import { saveOrder } from "@/lib/cart";
import { Trash2, ArrowRight, PackageCheck, Minus, Plus } from "lucide-react";
import { formatMoney, DEFAULT_CURRENCY } from "@/lib/currency";
import { CartSkeleton } from "../_components/Skeleton";
import { useHydrated } from "../_components/useHydrated";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const hydrated = useHydrated();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const currency =
    cart.length > 0 ? (cart[0].currency ?? DEFAULT_CURRENCY) : DEFAULT_CURRENCY;

  async function handleCheckout() {
    if (isCheckingOut || cart.length === 0) return;
    setIsCheckingOut(true);
    track({
      type: "begin_checkout",
      value: total,
      itemCount: cart.length,
      currency,
    });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total, currency }),
      });

      if (!res.ok) {
        throw new Error(`Checkout failed with status ${res.status}`);
      }

      const data = await res.json();

      if (!data?.order) {
        throw new Error("Checkout response did not include an order.");
      }

      // Only mutate local state once we have a confirmed order.
      try {
        saveOrder(data.order);
      } catch {
        // ignore storage errors — the order is still valid server-side
      }

      try {
        clearCart();
      } catch {
        // ignore
      }

      track({
        type: "purchase",
        orderId: data.order.id,
        value: total,
        itemCount: cart.length,
        currency,
      });
      toast.success("Order placed successfully.");
      router.push("/checkout");
    } catch (error) {
      console.error("[checkout] failed", error);
      toast.error("We couldn’t place your order. Please try again.");
      setIsCheckingOut(false);
    }
  }

  return (
    <section
      aria-label="Shopping cart"
      className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Your basket
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">Cart</h1>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
        >
          View orders <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {!hydrated ? (
        <CartSkeleton />
      ) : cart.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          <p className="text-lg font-medium">Your cart is empty.</p>
          <p className="mt-2 text-sm">
            Add a product to keep it here for later.
          </p>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <ul className="space-y-3" aria-label="Cart items">
            {cart.map((item) => (
              <li
                key={item.objectID}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      <Link
                        href={`/products/${item.objectID}`}
                        className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                      >
                        {item.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatMoney(item.price, item.currency ?? currency)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-slate-300">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.objectID, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span
                        className="w-9 text-center text-sm font-semibold text-slate-950"
                        aria-live="polite"
                        aria-label={`Quantity of ${item.name}: ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.objectID, item.quantity + 1)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                        className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="w-24 text-right text-sm font-semibold text-slate-900">
                      {formatMoney(
                        item.price * item.quantity,
                        item.currency ?? currency,
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        track({
                          type: "remove_from_cart",
                          productId: item.objectID,
                          name: item.name,
                          quantity: item.quantity,
                        });
                        removeFromCart(item.objectID);
                      }}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="sticky top-6 self-start rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900">
              <PackageCheck className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Order summary</h2>
            </div>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <dt>Items</dt>
                <dd>{cart.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Total</dt>
                <dd className="text-base font-semibold text-slate-950">
                  {formatMoney(total, currency)}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="cursor-pointer mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCheckingOut ? "Placing order…" : "Checkout"}
              {!isCheckingOut && <ArrowRight className="h-4 w-4" />}
            </button>

            <Link
              href="/products"
              className="mt-3 block rounded-full px-5 py-2 text-center text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              Continue shopping
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="cursor-pointer mt-1 block w-full rounded-full px-5 py-2 text-center text-sm font-medium text-slate-400 transition hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
