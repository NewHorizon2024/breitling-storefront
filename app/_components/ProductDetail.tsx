"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import type { Product } from "@/models";
import { formatMoney } from "@/lib/currency";
import { Minus, Plus, ShoppingCart, ArrowRight, Truck } from "lucide-react";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import { useAddToCart } from "./useAddToCart";

type ProductDetailProps = Readonly<{
  product: Product;
}>;

export default function ProductDetail({ product }: ProductDetailProps) {
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    track({
      type: "view_product",
      productId: product.objectID,
      name: product.name,
      price: product.price,
      currency: product.currency,
      brand: product.brand,
    });
  }, [
    product.objectID,
    product.name,
    product.price,
    product.currency,
    product.brand,
  ]);

  function handleAdd() {
    addToCart(product, quantity);
    setAdded(true);
  }

  return (
    <article className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6"
        />
        {product.free_shipping && (
          <span
            className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
            aria-label="Free shipping available"
          >
            Free Shipping
          </span>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {product.brand ?? "Product details"}
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">
            {product.name}
          </h1>
          {product.rating !== undefined && (
            <StarRating rating={product.rating} showValue />
          )}
          {product.description && (
            <p className="text-base leading-7 text-slate-700">
              {product.description}
            </p>
          )}
        </header>

        <p className="text-3xl font-semibold text-slate-950">
          {formatMoney(product.price, product.currency)}
        </p>

        <dl className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Type</dt>
            <dd className="mt-1 text-lg text-slate-700">
              {product.type ?? "Premium item"}
            </dd>
          </div>
          {product.color && (
            <div>
              <dt className="text-sm font-medium text-slate-500">Color</dt>
              <dd className="mt-1 text-lg text-slate-700">{product.color}</dd>
            </div>
          )}
          {product.brand && (
            <div>
              <dt className="text-sm font-medium text-slate-500">Brand</dt>
              <dd className="mt-1 text-lg text-slate-700">{product.brand}</dd>
            </div>
          )}
          {product.free_shipping && (
            <div>
              <dt className="text-sm font-medium text-slate-500">Shipping</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 text-lg text-slate-700">
                <Truck className="h-4 w-4 text-slate-500" aria-hidden="true" />
                Free shipping
              </dd>
            </div>
          )}
        </dl>

        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-slate-300">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span
              className="w-10 text-center text-sm font-semibold text-slate-950"
              aria-live="polite"
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Add to cart
          </button>

          {added && (
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              View cart
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
