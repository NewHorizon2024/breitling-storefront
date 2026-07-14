import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

const items = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Navitimer B01" },
];

describe("Breadcrumbs", () => {
  it("renders a labelled breadcrumb nav with links for non-current crumbs", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/products");
  });

  it("marks the last crumb as the current page and not a link", () => {
    render(<Breadcrumbs items={items} />);
    const current = screen.getByText("Navitimer B01");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Navitimer B01" })).not.toBeInTheDocument();
  });

  it("emits BreadcrumbList JSON-LD for SEO", () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(3);
    expect(data.itemListElement.map((x: { name: string }) => x.name)).toEqual([
      "Home",
      "Products",
      "Navitimer B01",
    ]);
  });
});
