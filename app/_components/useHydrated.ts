"use client";

import { useSyncExternalStore } from "react";

// Never changes after mount, so the subscribe callback is a no-op.
const subscribe = () => () => {};

/**
 * Returns `false` during server render and the first client render, then `true`
 * once hydrated. Lets client components read browser-only state (localStorage)
 * and swap a skeleton for real content without a hydration mismatch or a
 * `setState`-in-effect. Built on `useSyncExternalStore` so it plays well with
 * React's concurrent rendering.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
