import { searchProductsPage } from "../../lib/algolia";
import Filters from "../_components/Filters";
import PaginationControls from "../_components/PaginationControls";
import ProductsList from "../_components/ProductsList";
import ScrollToTop from "../_components/ScrollToTop";

type ProductsPageProps = Readonly<{
  searchParams?: Promise<{
    q?: string | string[];
    brand?: string | string[];
    color?: string | string[];
    type?: string | string[];
    minPrice?: string | string[];
    maxPrice?: string | string[];
    page?: string | string[];
  }>;
}>;

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function quoteFacetValue(value: string) {
  return `"${value.replace(/([\\"])/g, "\\$1")}"`;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = readParam(resolvedSearchParams.q) ?? "";
  const brand = readParam(resolvedSearchParams.brand);
  const color = readParam(resolvedSearchParams.color);
  const type = readParam(resolvedSearchParams.type);
  const minPrice = readParam(resolvedSearchParams.minPrice);
  const maxPrice = readParam(resolvedSearchParams.maxPrice);
  const page = Number(readParam(resolvedSearchParams.page) ?? 1);

  const activeFilters = [
    brand ? `brand:${quoteFacetValue(brand)}` : null,
    color ? `color:${quoteFacetValue(color)}` : null,
    type ? `type:${quoteFacetValue(type)}` : null,
    minPrice ? `price >= ${Number(minPrice)}` : null,
    maxPrice ? `price <= ${Number(maxPrice)}` : null,
  ].filter(Boolean);

  const filters = activeFilters.join(" AND ");

  const brandFacetFilters = [
    color ? `color:${quoteFacetValue(color)}` : null,
    type ? `type:${quoteFacetValue(type)}` : null,
    minPrice ? `price >= ${Number(minPrice)}` : null,
    maxPrice ? `price <= ${Number(maxPrice)}` : null,
  ]
    .filter(Boolean)
    .join(" AND ");

  const typeFacetFilters = [
    color ? `color:${quoteFacetValue(color)}` : null,
    brand ? `brand:${quoteFacetValue(brand)}` : null,
    minPrice ? `price >= ${Number(minPrice)}` : null,
    maxPrice ? `price <= ${Number(maxPrice)}` : null,
  ]
    .filter(Boolean)
    .join(" AND ");

  const res = await searchProductsPage({
    query,
    filters,
    brandFacetFilters,
    typeFacetFilters,
    page: Math.max(page - 1, 0),
  });

  return (
    <section
      aria-label="Product listing"
      className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="space-y-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
          Curated picks
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Discover products
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          Browse premium essentials with refined filtering and a seamless
          shopping experience.
        </p>
      </header>

      <div className="sticky top-20 z-30 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 sm:p-6">
        <Filters
          current={{ brand, type, minPrice, maxPrice }}
          brandOptions={res.brandOptions}
          typeOptions={res.typeOptions}
          minPrice={res.minPrice}
          maxPrice={res.maxPrice}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-slate-600">
          Showing {res.hits.length} of {res.nbHits} products
        </p>
        <p className="text-sm text-slate-500">
          Page {Math.min(page, res.nbPages || 1)} of {res.nbPages || 1}
        </p>
      </div>

      {res.hits.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No products match these filters
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Try adjusting the filters or clearing the current selections to see
            more results.
          </p>
        </div>
      ) : (
        <>
          <h2 className="sr-only">Products</h2>
          <ProductsList products={res.hits} />
          <PaginationControls currentPage={page} pageCount={res.nbPages || 1} />
        </>
      )}

      <ScrollToTop />
    </section>
  );
}
