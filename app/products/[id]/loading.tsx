import { ProductDetailSkeleton } from "../../_components/Skeleton";

export default function Loading() {
  return (
    <section aria-label="Loading product details" aria-busy="true" className="pt-10">
      <ProductDetailSkeleton />
    </section>
  );
}
