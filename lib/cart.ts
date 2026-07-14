export type CartItem = Readonly<{
  objectID: string;
  name: string;
  price: number;
  quantity: number;
  currency?: string;
}>;

export type OrderStatus = "Pending" | "In Transit" | "Delivered";

export type OrderItem = CartItem & { status?: OrderStatus };

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
  currency?: string;
};

const STORAGE_KEY = "breitling_cart";
const ORDERS_KEY = "breitling_orders";

export function loadCart(): CartItem[] {
  if (typeof globalThis === "undefined") return [];
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addToCart(cart: CartItem[], item: CartItem): CartItem[] {
  const existing = cart.find((c) => c.objectID === item.objectID);
  let next;
  if (existing) {
    next = cart.map((c) =>
      c.objectID === item.objectID
        ? { ...c, quantity: c.quantity + item.quantity }
        : c,
    );
  } else {
    next = [...cart, item];
  }
  saveCart(next);
  return next;
}

export function removeFromCart(cart: CartItem[], objectID: string): CartItem[] {
  const next = cart.filter((item) => item.objectID !== objectID);
  saveCart(next);
  return next;
}

export function setQuantity(
  cart: CartItem[],
  objectID: string,
  quantity: number,
): CartItem[] {
  const q = Math.max(1, Math.floor(quantity));
  const next = cart.map((item) =>
    item.objectID === objectID ? { ...item, quantity: q } : item,
  );
  saveCart(next);
  return next;
}

export function clearCart() {
  saveCart([]);
}

// --- Reactive cart store (for useSyncExternalStore) ---
const EMPTY_CART: CartItem[] = [];
let cartSnapshot: CartItem[] | null = null;
const cartListeners = new Set<() => void>();

function currentCart(): CartItem[] {
  if (cartSnapshot === null) cartSnapshot = loadCart();
  return cartSnapshot;
}

function emitCart() {
  for (const listener of cartListeners) listener();
}

export function subscribeCart(listener: () => void): () => void {
  cartListeners.add(listener);
  return () => {
    cartListeners.delete(listener);
  };
}

export function getCartSnapshot(): CartItem[] {
  return currentCart();
}

export function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function addToCartStore(item: CartItem) {
  cartSnapshot = addToCart(currentCart(), item);
  emitCart();
}

export function removeFromCartStore(objectID: string) {
  cartSnapshot = removeFromCart(currentCart(), objectID);
  emitCart();
}

export function setQuantityStore(objectID: string, quantity: number) {
  cartSnapshot = setQuantity(currentCart(), objectID, quantity);
  emitCart();
}

export function clearCartStore() {
  clearCart();
  cartSnapshot = EMPTY_CART;
  emitCart();
}

export function loadOrders(): Order[] {
  if (typeof globalThis === "undefined") return [];
  try {
    const raw = globalThis.localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return;
  const orders = loadOrders();
  const next = [order, ...orders].slice(0, 8);
  globalThis.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
}
