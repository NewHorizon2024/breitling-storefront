"use client";

import Link from "next/link";
import type { Product } from "@/models";
import { formatMoney } from "@/lib/currency";
import { ShoppingCart } from "lucide-react";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import { useAddToCart } from "./useAddToCart";

type ProductCardProps = Readonly<{
  product: Product;
}>;

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] focus-within:ring-2 focus-within:ring-slate-900">
      <Link
        href={`/products/${product.objectID}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        aria-label={`View details for ${product.name} — ${formatMoney(product.price, product.currency)}`}
      >
        <div className="relative h-60 w-full overflow-hidden bg-slate-100">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />

          {product.free_shipping && (
            <span
              className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
              aria-label="Free shipping available"
            >
              Free Shipping
            </span>
          )}
        </div>

        <div className="space-y-2 p-5 pb-3">
          {product.brand && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {product.brand}
            </p>
          )}

          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 transition group-hover:text-slate-700">
            {product.name}
          </h3>

          {product.rating !== undefined && (
            <StarRating rating={product.rating} showValue />
          )}

          <p className="pt-1 text-xl font-semibold text-slate-950">
            {formatMoney(product.price, product.currency)}
          </p>
        </div>
      </Link>

      <div className="mt-auto px-5 pb-5">
        <button
          type="button"
          onClick={() => addToCart(product, 1)}
          aria-label={`Add ${product.name} to cart`}
          className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Add to cart
        </button>
      </div>
    </article>
  );
}
