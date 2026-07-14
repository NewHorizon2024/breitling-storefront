"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";
import { useHydrated } from "./useHydrated";
import { formatMoney, DEFAULT_CURRENCY } from "@/lib/currency";

export default function MiniCart() {
  const { cart, cartCount, removeFromCart } = useCart();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const count = hydrated ? cartCount : 0;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currency = cart[0]?.currency ?? DEFAULT_CURRENCY;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mini-cart-panel"
        aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}
        className="cursor-pointer relative flex items-center rounded-full text-gray-700 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
      >
        <ShoppingCart className="h-6 w-6" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-[11px] font-semibold text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          id="mini-cart-panel"
          role="dialog"
          aria-label="Cart preview"
          className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Your cart</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="Close cart preview"
              className="cursor-pointer rounded-full p-1 text-slate-400 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {count === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Your cart is empty.
            </p>
          ) : (
            <>
              <ul className="mt-3 max-h-64 space-y-3 overflow-auto pr-1">
                {cart.map((item) => (
                  <li
                    key={item.objectID}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.objectID}`}
                        onClick={() => setOpen(false)}
                        className="block truncate rounded text-sm font-medium text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        Qty {item.quantity} ·{" "}
                        {formatMoney(item.price, item.currency ?? currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatMoney(
                          item.price * item.quantity,
                          item.currency ?? currency,
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.objectID)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="cursor-pointer rounded-full p-1 text-slate-400 transition hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="text-sm font-semibold text-slate-950">
                  {formatMoney(total, currency)}
                </span>
              </div>

              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                View cart
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
