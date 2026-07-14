import ProductDetail from "@/app/_components/ProductDetail";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import { getProductById } from "../../../lib/algolia";
import { notFound } from "next/navigation";

type ProductPageProps = Readonly<{ params: Promise<{ id: string }> }>;

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <section aria-label="Product details" className="pt-10">
      <div className="mx-auto max-w-5xl px-4 pb-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name },
          ]}
        />
      </div>
      <ProductDetail product={product} />
    </section>
  );
}
