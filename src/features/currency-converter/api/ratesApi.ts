export type RatesTable = Record<string, number>;

interface RatesResponse {
  result: string;
  base_code: string;
  rates: RatesTable;
}

const API_URL = "https://open.er-api.com/v6/latest/USD";

/**
 * Approximate rates relative to USD, used only when both the network
 * request and the offline query cache are unavailable (e.g. first launch
 * with no connection).
 */
export const FALLBACK_RATES_USD: RatesTable = {
  USD: 1,
  EUR: 0.92,
  RUB: 92,
  GBP: 0.79,
  JPY: 149,
  CNY: 7.2,
  CHF: 0.88,
  KZT: 480,
  UAH: 41,
  TRY: 34,
  AED: 3.67,
  GEL: 2.7,
};

export async function fetchRates(signal?: AbortSignal): Promise<RatesTable> {
  const res = await fetch(API_URL, { signal });
  if (!res.ok) {
    throw new Error(`Rates request failed: HTTP ${res.status}`);
  }

  const data = (await res.json()) as RatesResponse;
  if (!data.rates || typeof data.rates.USD === "undefined") {
    throw new Error("Rates response is missing expected fields");
  }

  return data.rates;
}
