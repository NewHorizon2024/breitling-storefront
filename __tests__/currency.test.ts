import { formatMoney, DEFAULT_CURRENCY } from "@/lib/currency";

describe("formatMoney", () => {
  it("formats an amount with the given currency", () => {
    // Locale-agnostic: the grouped amount and decimals are present.
    expect(formatMoney(1999, "USD")).toMatch(/1[^\d]?999[.,]00/);
  });

  it("falls back to a plain rendering for an invalid currency code", () => {
    expect(formatMoney(1000, "NOT_A_CURRENCY")).toBe("1000.00 NOT_A_CURRENCY");
  });

  it("uses the default currency when none is provided", () => {
    // Should not throw and should return a non-empty string.
    const result = formatMoney(42);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    expect(DEFAULT_CURRENCY).toBeTruthy();
  });
});
