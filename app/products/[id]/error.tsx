"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import ErrorState from "../../_components/ErrorState";

type ProductErrorProps = Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>;

export default function ProductError({
  error,
  unstable_retry,
}: ProductErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      aria-label="Error"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <ErrorState
        title="We couldn't load this product"
        description="Something went wrong while fetching this product's details. Please try again."
        onRetry={unstable_retry}
        digest={error.digest}
      />
    </section>
  );
}
