"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import ErrorState from "../_components/ErrorState";

type ProductsErrorProps = Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>;

export default function ProductsError({
  error,
  unstable_retry,
}: ProductsErrorProps) {
  
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      aria-label="Error"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <ErrorState
        title="We couldn't load products"
        description="The product catalog is temporarily unavailable. This is usually a brief hiccup — please try again."
        onRetry={unstable_retry}
        digest={error.digest}
      />
    </section>
  );
}
