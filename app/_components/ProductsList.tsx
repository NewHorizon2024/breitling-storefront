import type { Product } from "@/models";
import ProductCard from "./ProductCard";

type ProductsListProps = Readonly<{
  products: Product[];
}>;

export default function ProductsList({ products }: ProductsListProps) {
  return (
    <ul
      aria-label="Products"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {products.map((product) => (
        <li key={product.objectID} className="list-none">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
