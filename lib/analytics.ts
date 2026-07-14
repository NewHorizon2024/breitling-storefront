/**
 * Lightweight, typed analytics for common storefront events.
 *
 * Every event goes through {@link track}, which enriches it with sensible
 * context (timestamp, page path, anonymous id) and fans it out to one or more
 * providers. Out of the box it logs to the console; point it at a live service
 * by setting `NEXT_PUBLIC_ANALYTICS_ENDPOINT`, or register your own provider
 * (GA, PostHog, Segment, …) via {@link registerAnalyticsProvider}.
 */

const ANON_ID_KEY = "breitling_analytics_id";

/** The catalog of events the storefront can emit, with per-event payloads. */
export type AnalyticsEvent =
  | {
      type: "view_product";
      productId: string;
      name?: string;
      price?: number;
      currency?: string;
      brand?: string;
    }
  | {
      type: "add_to_cart";
      productId: string;
      quantity: number;
      name?: string;
      price?: number;
      currency?: string;
    }
  | {
      type: "remove_from_cart";
      productId: string;
      name?: string;
      quantity?: number;
    }
  | { type: "begin_checkout"; value: number; itemCount: number; currency?: string }
  | {
      type: "purchase";
      orderId: string;
      value: number;
      itemCount: number;
      currency?: string;
    };

/** Convenience alias for a specific event's shape, e.g. `AnalyticsEventOf<"purchase">`. */
export type AnalyticsEventOf<T extends AnalyticsEvent["type"]> = Extract<
  AnalyticsEvent,
  { type: T }
>;

/** An event after {@link track} enriches it with common context. */
export type TrackedEvent = AnalyticsEvent & {
  /** ISO-8601 time the event fired. */
  ts: string;
  /** Path the event fired on (client only). */
  path?: string;
  /** Stable per-browser id for correlating a session (client only, best-effort). */
  anonymousId?: string;
};

/** A sink that receives every tracked event. Must not throw. */
export type AnalyticsProvider = (event: TrackedEvent) => void;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Best-effort stable anonymous id, persisted in localStorage on the client. */
function getAnonymousId(): string | undefined {
  if (!isBrowser()) return undefined;
  try {
    const existing = window.localStorage.getItem(ANON_ID_KEY);
    if (existing) return existing;
    const id =
      globalThis.crypto?.randomUUID?.() ??
      `anon-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANON_ID_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}

/** Default provider: readable, grouped console output. */
const consoleProvider: AnalyticsProvider = (event) => {
  const { type, ts, ...rest } = event;
  console.log(`[analytics] ${type}`, { ts, ...rest });
};

/**
 * Optional provider: ships events to a collector endpoint. Uses `sendBeacon`
 * when available (survives page navigation), falling back to a keepalive fetch.
 */
function createEndpointProvider(endpoint: string): AnalyticsProvider {
  return (event) => {
    const body = JSON.stringify(event);
    if (isBrowser() && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(endpoint, body);
      return;
    }
    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Swallow — analytics delivery must never surface to the user.
    });
  };
}

const providers: AnalyticsProvider[] = [consoleProvider];

const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
if (endpoint) {
  providers.push(createEndpointProvider(endpoint));
}

/** Register an additional sink (e.g. a real analytics SDK). */
export function registerAnalyticsProvider(provider: AnalyticsProvider): void {
  providers.push(provider);
}

/**
 * Track a storefront event. Enriches the payload with context and forwards it to
 * every provider. Guaranteed not to throw — a broken provider can never break a
 * user flow.
 */
export function track(event: AnalyticsEvent): void {
  const enriched: TrackedEvent = {
    ...event,
    ts: new Date().toISOString(),
    ...(isBrowser()
      ? { path: window.location.pathname, anonymousId: getAnonymousId() }
      : {}),
  };

  for (const provider of providers) {
    try {
      provider(enriched);
    } catch (error) {
      console.error("[analytics] provider error", error);
    }
  }
}
