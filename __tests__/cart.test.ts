import {
  addToCart,
  removeFromCart,
  setQuantity,
  loadCart,
  saveCart,
  type CartItem,
} from "@/lib/cart";

const item = (objectID: string, quantity = 1): CartItem => ({
  objectID,
  name: `Product ${objectID}`,
  price: 100,
  quantity,
  currency: "USD",
});

beforeEach(() => {
  window.localStorage.clear();
});

describe("cart operations", () => {
  it("adds a new item", () => {
    expect(addToCart([], item("a"))).toEqual([item("a")]);
  });

  it("increments quantity when adding an existing item", () => {
    const next = addToCart([item("a", 1)], item("a", 2));
    expect(next).toHaveLength(1);
    expect(next[0].quantity).toBe(3);
  });

  it("removes an item by id", () => {
    expect(removeFromCart([item("a"), item("b")], "a")).toEqual([item("b")]);
  });

  it("sets an explicit quantity, clamping to a minimum of 1 and flooring", () => {
    expect(setQuantity([item("a", 1)], "a", 5)[0].quantity).toBe(5);
    expect(setQuantity([item("a", 3)], "a", 0)[0].quantity).toBe(1);
    expect(setQuantity([item("a", 3)], "a", 2.9)[0].quantity).toBe(2);
  });

  it("persists to and reads back from localStorage", () => {
    saveCart([item("a", 2)]);
    expect(loadCart()).toEqual([item("a", 2)]);
  });
});
