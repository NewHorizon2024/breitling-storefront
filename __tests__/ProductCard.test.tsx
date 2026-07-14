import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "@/app/_components/ProductCard";
import { CartProvider } from "@/app/_components/CartContext";
import type { Product } from "@/models";

const product: Product = {
  objectID: "p1",
  name: "Test Watch",
  price: 1999,
  currency: "USD",
  brand: "Breitling",
  rating: 4.5,
  free_shipping: true,
};

function renderCard() {
  return render(
    <CartProvider>
      <ProductCard product={product} />
    </CartProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("ProductCard", () => {
  it("renders the product's key details", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: "Test Watch" })).toBeInTheDocument();
    expect(screen.getByText("Breitling")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Rated 4\.5 out of 5/ })).toBeInTheDocument();
    expect(screen.getByText(/1[^\d]?999/)).toBeInTheDocument();
    expect(screen.getByText("Free Shipping")).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    renderCard();
    expect(
      screen.getByRole("link", { name: /View details for Test Watch/ }),
    ).toHaveAttribute("href", "/products/p1");
  });

  it("adds the product to the cart when the quick-add button is clicked", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: /Add Test Watch to cart/ }));

    const stored = JSON.parse(window.localStorage.getItem("breitling_cart") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ objectID: "p1", quantity: 1 });
  });
});
