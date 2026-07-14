"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import ErrorState from "./_components/ErrorState";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>;

export default function Error({ error, unstable_retry }: ErrorProps) {
  useEffect(() => {
    // Surface to logs / an error reporting service.
    console.error(error);
  }, [error]);

  return (
    <section
      aria-label="Error"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <ErrorState onRetry={unstable_retry} digest={error.digest} />
    </section>
  );
}
