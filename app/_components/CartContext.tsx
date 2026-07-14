"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import {
  CartItem,
  subscribeCart,
  getCartSnapshot,
  getServerCartSnapshot,
  addToCartStore,
  removeFromCartStore,
  setQuantityStore,
  clearCartStore,
} from "@/lib/cart";

type CartContextValue = Readonly<{
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (objectID: string) => void;
  updateQuantity: (objectID: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}>;

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function CartProvider({ children }: CartProviderProps) {
  const cart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const addToCart = useCallback((item: CartItem) => addToCartStore(item), []);
  const removeFromCart = useCallback(
    (objectID: string) => removeFromCartStore(objectID),
    [],
  );
  const updateQuantity = useCallback(
    (objectID: string, quantity: number) =>
      setQuantityStore(objectID, quantity),
    [],
  );
  const clearCart = useCallback(() => clearCartStore(), []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
