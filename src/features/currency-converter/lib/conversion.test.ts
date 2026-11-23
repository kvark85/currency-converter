import { describe, expect, it } from "vitest";
import { getRatesStatus, getUnitRate, orderCurrencies, parseAmount } from "./conversion";
import { CURRENCIES } from "./currencies";

const RATES = { USD: 1, EUR: 0.9, PLN: 4, JPY: 150 };

describe("getUnitRate", () => {
  it("goes through USD for two non-USD currencies", () => {
    expect(getUnitRate("EUR", "PLN", RATES)).toBeCloseTo(4 / 0.9);
  });

  it("is 1 for the same currency", () => {
    expect(getUnitRate("PLN", "PLN", RATES)).toBe(1);
  });

  it("is null when a rate is missing", () => {
    expect(getUnitRate("USD", "GBP", RATES)).toBeNull();
  });
});

describe("parseAmount", () => {
  it.each([
    ["100", 100],
    ["2,5", 2.5],
    ["2.5", 2.5],
    [".5", 0.5],
    ["5.", 5],
    ["1\u00a0234.56", 1234.56],
    ["1,234.56", 1234.56],
    ["1.234,56", 1234.56],
  ])("parses %s", (text, expected) => {
    expect(parseAmount(text)).toBe(expected);
  });

  it.each(["", "abc", "12abc", "-5", "1.2.3", "."])("rejects '%s'", (text) => {
    expect(parseAmount(text)).toBeNull();
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

  it("is 'updating' while refetching in the background", () => {
    expect(getRatesStatus({ ...idle, isFetching: true })).toBe("updating");
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
