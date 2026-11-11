import { describe, expect, it } from "vitest";
import { convert, getRatesStatus, orderCurrencies } from "./conversion";
import { CURRENCIES } from "./currencies";

const RATES = { USD: 1, EUR: 0.9, PLN: 4, JPY: 150 };

describe("convert", () => {
  it("converts from USD to another currency", () => {
    expect(convert("100", "USD", "EUR", RATES)).toEqual({ convertedAmount: 90, unitRate: 0.9 });
  });

  it("converts between two non-USD currencies through USD", () => {
    const { convertedAmount, unitRate } = convert("90", "EUR", "PLN", RATES);
    expect(convertedAmount).toBeCloseTo(400);
    expect(unitRate).toBeCloseTo(4 / 0.9);
  });

  it("returns the same amount for the same currency", () => {
    expect(convert("42", "PLN", "PLN", RATES)).toEqual({ convertedAmount: 42, unitRate: 1 });
  });

  it("accepts a comma as the decimal separator", () => {
    expect(convert("2,5", "USD", "PLN", RATES).convertedAmount).toBe(10);
  });

  it("returns nulls for empty or non-numeric input", () => {
    expect(convert("", "USD", "EUR", RATES)).toEqual({ convertedAmount: null, unitRate: null });
    expect(convert("abc", "USD", "EUR", RATES)).toEqual({ convertedAmount: null, unitRate: null });
  });

  it("returns nulls when a rate is missing", () => {
    expect(convert("10", "USD", "GBP", RATES)).toEqual({ convertedAmount: null, unitRate: null });
  });
});

describe("getRatesStatus", () => {
  const idle = { hasLiveRates: true, isLoading: false, isFetching: false, isError: false };

  it("is 'loading' on the first request", () => {
    expect(getRatesStatus({ ...idle, hasLiveRates: false, isLoading: true })).toBe("loading");
  });

  it("is 'live' when fresh rates are loaded", () => {
    expect(getRatesStatus(idle)).toBe("live");
  });

  it("is 'cached' while refetching in the background", () => {
    expect(getRatesStatus({ ...idle, isFetching: true })).toBe("cached");
  });

  it("is 'cached' when the request failed but previous rates are kept", () => {
    expect(getRatesStatus({ ...idle, isError: true })).toBe("cached");
  });

  it("is 'offline-fallback' when the request failed and there are no rates", () => {
    expect(getRatesStatus({ ...idle, hasLiveRates: false, isError: true })).toBe("offline-fallback");
  });
});

describe("orderCurrencies", () => {
  it("puts the current value first and keeps the default order for the rest", () => {
    const { orderedCurrencies, pinnedCount } = orderCurrencies("PLN", []);
    expect(orderedCurrencies[0]).toBe("PLN");
    expect(orderedCurrencies.slice(1)).toEqual(CURRENCIES.filter((c) => c !== "PLN"));
    expect(pinnedCount).toBe(1);
  });

  it("pins recently used currencies after the current value without duplicates", () => {
    const { orderedCurrencies, pinnedCount } = orderCurrencies("EUR", ["PLN", "EUR", "JPY"]);
    expect(orderedCurrencies.slice(0, 3)).toEqual(["EUR", "PLN", "JPY"]);
    expect(pinnedCount).toBe(3);
  });

  it("always contains every currency exactly once", () => {
    const { orderedCurrencies } = orderCurrencies("GBP", ["USD", "UAH"]);
    expect([...orderedCurrencies].sort()).toEqual([...CURRENCIES].sort());
  });
});
