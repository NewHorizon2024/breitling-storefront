import type { Product } from "@/models";
import { algoliasearch } from "algoliasearch";
import { unstable_cache } from "next/cache";
import { decodeEntities, decodeMaybe } from "./text";

/**
 * Some source records store entity-encoded free text (e.g. `At&#38;t`). Decode
 * the user-facing fields once, at the data boundary, so everything downstream
 * (cards, detail, cart, orders) receives clean values.
 */
function normalizeProduct(product: Product): Product {
  return {
    ...product,
    name: decodeEntities(product.name),
    description: decodeMaybe(product.description),
    type: decodeMaybe(product.type),
    brand: decodeMaybe(product.brand),
    color: decodeMaybe(product.color),
  };
}

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!;

// Catalog data changes rarely, so cache generously to avoid hammering Algolia.
const CATALOG_REVALIDATE = 300; // seconds
const HITS_PER_PAGE = 20;

export type ProductsPageResult = {
  hits: Product[];
  nbHits: number;
  page: number;
  nbPages: number;
  minPrice?: number;
  maxPrice?: number;
  brandOptions: string[];
  typeOptions: string[];
};

function readFacetValue(hit: Product, fieldName: string) {
  const record = hit as Product & Record<string, unknown>;
  const value = record[fieldName];
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim()) return value[0].trim();
  return undefined;
}

function buildFacetOptions(hits: Product[], facets?: Record<string, Record<string, number>>) {
  const options: Record<string, string[]> = {};
  const fields = ['brand', 'type', 'color'];
  for (const field of fields) {
    const seen = new Set<string>();
    if (facets?.[field]) {
      Object.keys(facets[field]).forEach(value => seen.add(value));
    }
    hits.forEach(hit => {
      const value = readFacetValue(hit, field);
      if (value) seen.add(value);
    });
    options[field] = Array.from(seen).sort((a, b) => a.localeCompare(b));
  }
  return options;
}

type BatchResult = {
  hits?: Product[];
  nbHits?: number;
  nbPages?: number;
  page?: number;
  facets?: Record<string, Record<string, number>>;
};

/**
 * Fetches a product page plus disjunctive brand/type facet options in a SINGLE
 * batched Algolia request (`client.search` multi-query) instead of three
 * separate round trips. The facet requests use `hitsPerPage: 0` so they return
 * only facet counts, never product records. Cached in Next's Data Cache.
 */
const getProductsPage = unstable_cache(
  async (
    query: string,
    filters: string,
    brandFacetFilters: string,
    typeFacetFilters: string,
    page: number,
  ) => {
    const { results } = await client.search<Product>({
      requests: [
        // Main listing — facets handled by the two disjunctive requests below.
        { indexName, query, filters, hitsPerPage: HITS_PER_PAGE, page },
        // Brand options, as if the brand filter weren't applied.
        {
          indexName,
          query,
          filters: brandFacetFilters,
          hitsPerPage: 0,
          facets: ['brand'],
          maxValuesPerFacet: 100,
        },
        // Type options, as if the type filter weren't applied.
        {
          indexName,
          query,
          filters: typeFacetFilters,
          hitsPerPage: 0,
          facets: ['type'],
          maxValuesPerFacet: 100,
        },
      ],
    });

    const [main, brandRes, typeRes] = results as unknown as BatchResult[];

    const hits = (main.hits ?? []).map(normalizeProduct);
    let minPrice: number | undefined = undefined;
    let maxPrice: number | undefined = undefined;
    for (const h of hits) {
      if (typeof h.price === 'number') {
        if (minPrice === undefined || h.price < minPrice) minPrice = h.price;
        if (maxPrice === undefined || h.price > maxPrice) maxPrice = h.price;
      }
    }

    return {
      hits,
      nbHits: main.nbHits ?? 0,
      page: main.page ?? 0,
      nbPages: main.nbPages ?? 0,
      minPrice,
      maxPrice,
      // hits are [] here so buildFacetOptions relies purely on facet counts.
      brandOptions: buildFacetOptions([], brandRes.facets).brand,
      typeOptions: buildFacetOptions([], typeRes.facets).type,
    };
  },
  ['products-page'],
  {
    revalidate: CATALOG_REVALIDATE,
    tags: ['products'],
  },
);

export async function searchProductsPage(params: {
  query: string;
  filters: string;
  brandFacetFilters: string;
  typeFacetFilters: string;
  page: number;
}): Promise<ProductsPageResult> {
  try {
    return await getProductsPage(
      params.query,
      params.filters,
      params.brandFacetFilters,
      params.typeFacetFilters,
      params.page,
    );
  } catch (error) {
    // The listing can't render without results — surface a clean error to the
    // nearest `error.tsx` boundary rather than a raw Algolia stack trace.
    console.error("[algolia] searchProductsPage failed", error);
    throw new Error("Failed to load products");
  }
}

function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }
  return undefined;
}

const getFeatured = unstable_cache(
  async (limit: number) => {
    const { results } = await client.search<Product>({
      requests: [{ indexName, query: "", hitsPerPage: limit }],
    });
    const [main] = results as unknown as BatchResult[];
    return (main.hits ?? []).map(normalizeProduct);
  },
  ["featured-products"],
  { revalidate: CATALOG_REVALIDATE, tags: ["products"] },
);

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    return await getFeatured(limit);
  } catch (error) {
    // Featured is a nice-to-have on the home page — never let it break the page.
    console.error("[algolia] getFeaturedProducts failed", error);
    return [];
  }
}

const getProductByIdCached = unstable_cache(
  async (id: string) => client.getObject({ indexName, objectID: id }),
  ['product-by-id'],
  {
    revalidate: CATALOG_REVALIDATE,
    tags: ['products'],
  },
);

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = (await getProductByIdCached(id)) as unknown as Product;
    // Guard against an unexpected/empty payload shape.
    if (!product || !product.objectID) return null;
    return normalizeProduct(product);
  } catch (error) {
    // A missing object is an expected "not found" — let the caller 404 on null.
    if (getErrorStatus(error) === 404) return null;
    // Anything else (network, auth, 5xx) is a real error → error boundary.
    console.error("[algolia] getProductById failed", error);
    throw new Error("Failed to load product");
  }
}
