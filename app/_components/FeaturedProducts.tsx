import { getFeaturedProducts } from "@/lib/algolia";
import ProductCard from "./ProductCard";

// Async server component — streamed under a <Suspense> boundary on the home page.
export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.objectID} className="list-none">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
