import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StarRating from "@/app/_components/StarRating";

describe("StarRating", () => {
  it("exposes a single accessible label", () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByRole("img", { name: "Rated 4.5 out of 5" })).toBeInTheDocument();
  });

  it("optionally shows the numeric value", () => {
    render(<StarRating rating={3.2} showValue />);
    expect(screen.getByText("3.2")).toBeInTheDocument();
  });

  it("clamps out-of-range ratings", () => {
    const { rerender } = render(<StarRating rating={9} />);
    expect(screen.getByRole("img", { name: "Rated 5.0 out of 5" })).toBeInTheDocument();

    rerender(<StarRating rating={-2} />);
    expect(screen.getByRole("img", { name: "Rated 0.0 out of 5" })).toBeInTheDocument();
  });
});
