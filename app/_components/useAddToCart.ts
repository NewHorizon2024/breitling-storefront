"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import type { Product } from "@/models";
import { track } from "@/lib/analytics";
import { useCart } from "./CartContext";

/**
 * Shared add-to-cart action used by the product card (quick add) and the product
 * detail page. Adds the item, tracks the event with the real quantity, and shows
 * a confirmation toast. Post-add navigation is left to the caller.
 */
export function useAddToCart() {
  const { addToCart } = useCart();

  return useCallback(
    (product: Product, quantity = 1) => {
      addToCart({
        objectID: product.objectID,
        name: product.name,
        price: product.price,
        quantity,
        currency: product.currency,
      });
      track({
        type: "add_to_cart",
        productId: product.objectID,
        quantity,
        name: product.name,
        price: product.price,
        currency: product.currency,
      });
      toast.success(
        quantity > 1
          ? `${quantity} × ${product.name} added to cart.`
          : `${product.name} added to cart.`,
      );
    },
    [addToCart],
  );
}
