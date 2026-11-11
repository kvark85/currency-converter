import { describe, expect, it, vi } from "vitest";
import { FALLBACK_RATES_USD, fetchRates } from "./ratesApi";
import { CURRENCIES } from "../lib/currencies";

const mockFetch = (body: unknown, init: { ok?: boolean; status?: number } = {}) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  } as Response);

describe("fetchRates", () => {
  it("returns the rates table from the API response", async () => {
    const rates = { USD: 1, EUR: 0.9 };
    mockFetch({ result: "success", base_code: "USD", rates });

    await expect(fetchRates()).resolves.toEqual(rates);
  });

  it("throws on an HTTP error", async () => {
    mockFetch({}, { ok: false, status: 503 });

    await expect(fetchRates()).rejects.toThrow("HTTP 503");
  });

  it("throws when the response has an unexpected shape", async () => {
    mockFetch({ result: "error" });

    await expect(fetchRates()).rejects.toThrow("missing expected fields");
  });
});

describe("FALLBACK_RATES_USD", () => {
  it("has a positive rate for every supported currency", () => {
    for (const code of CURRENCIES) {
      expect(FALLBACK_RATES_USD[code]).toBeGreaterThan(0);
    }
  });
});
