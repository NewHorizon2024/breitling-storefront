"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { decodeEntities } from "@/lib/text";

type Current = Readonly<{
  brand?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

type FiltersProps = Readonly<{
  current: Current;
  brandOptions?: string[];
  typeOptions?: string[];
  minPrice?: number;
  maxPrice?: number;
}>;

export default function Filters({
  current,
  brandOptions,
  typeOptions,
  minPrice,
  maxPrice,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const brands = useMemo<string[]>(() => {
    const values = brandOptions ?? [];
    if (current.brand && !values.includes(current.brand)) {
      return [current.brand, ...values];
    }
    return values;
  }, [brandOptions, current.brand]);

  const types = useMemo<string[]>(() => {
    const values = typeOptions ?? [];
    if (current.type && !values.includes(current.type)) {
      return [current.type, ...values];
    }
    return values;
  }, [typeOptions, current.type]);

  const [localMin, setLocalMin] = useState(current.minPrice ?? "");
  const [localMax, setLocalMax] = useState(current.maxPrice ?? "");

  function updateParam(key: string, value?: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.push(`/products?${next.toString()}`);
  }

  function applyPrice() {
    updateParam("minPrice", localMin || undefined);
    updateParam("maxPrice", localMax || undefined);
  }

  const clearFilters = () => router.push("/products");

  function removeFilter(key: "brand" | "type" | "minPrice" | "maxPrice") {
    if (key === "minPrice") setLocalMin("");
    if (key === "maxPrice") setLocalMax("");
    updateParam(key, undefined);
  }

  const activeChips = [
    current.brand
      ? {
          key: "brand" as const,
          label: `Brand: ${decodeEntities(current.brand)}`,
        }
      : null,
    current.type
      ? { key: "type" as const, label: `Type: ${decodeEntities(current.type)}` }
      : null,
    current.minPrice
      ? { key: "minPrice" as const, label: `Min: ${current.minPrice}` }
      : null,
    current.maxPrice
      ? { key: "maxPrice" as const, label: `Max: ${current.maxPrice}` }
      : null,
  ].filter((chip) => chip !== null);

  const hasActiveFilters = activeChips.length > 0;

  const shareableUrl = (() => {
    const next = new URLSearchParams(params.toString());
    if (current.brand) next.set("brand", current.brand);
    else next.delete("brand");
    if (current.type) next.set("type", current.type);
    else next.delete("type");
    if (current.minPrice) next.set("minPrice", current.minPrice);
    else next.delete("minPrice");
    if (current.maxPrice) next.set("maxPrice", current.maxPrice);
    else next.delete("maxPrice");
    next.delete("page");
    const query = next.toString();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}${pathname}${query ? `?${query}` : ""}`;
  })();

  async function handleShare() {
    try {
      await globalThis.navigator.clipboard.writeText(shareableUrl);
      toast.success("Share link copied to clipboard.");
    } catch {
      toast.error("Unable to copy link automatically.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        aria-label="Filters"
        onSubmit={(e) => {
          e.preventDefault();
          applyPrice();
        }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6"
      >
        <fieldset className="flex min-w-0 flex-1 flex-col gap-2">
          <legend className="text-sm font-medium text-slate-700">Brand</legend>
          <select
            aria-label="Filter by brand"
            value={current.brand ?? ""}
            onChange={(e) => updateParam("brand", e.target.value || undefined)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {decodeEntities(b)}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="flex min-w-0 flex-1 flex-col gap-2">
          <legend className="text-sm font-medium text-slate-700">Type</legend>
          <select
            aria-label="Filter by type"
            value={current.type ?? ""}
            onChange={(e) => updateParam("type", e.target.value || undefined)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 pr-12 text-sm shadow-sm"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {decodeEntities(t)}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="flex min-w-0 flex-1 flex-col gap-2">
          <legend className="text-sm font-medium text-slate-700">Price</legend>
          <div className="flex gap-2">
            <input
              aria-label="Minimum price"
              inputMode="numeric"
              placeholder={minPrice ? minPrice.toString() : "Min"}
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className="w-24 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <input
              aria-label="Maximum price"
              inputMode="numeric"
              placeholder={maxPrice ? maxPrice.toString() : "Max"}
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className="w-24 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              Apply
            </button>
          </div>
        </fieldset>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            Share current view
          </button>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-700"
          >
            Clear
          </button>
        </div>
      </form>

      {hasActiveFilters && (
        <div
          className="flex flex-wrap items-center gap-2"
          aria-label="Active filters"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Active
          </span>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => removeFilter(chip.key)}
              aria-label={`Remove filter ${chip.label}`}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
