import { CURRENCIES, type Currency } from "./currencies";
import type { RatesTable } from "../api/ratesApi";

export type RatesStatus = "loading" | "live" | "cached" | "offline-fallback";

export interface ConversionResult {
  convertedAmount: number | null;
  unitRate: number | null;
}

/**
 * Converts an amount typed by the user between two currencies. All rates are
 * relative to USD, so the amount goes through USD. Accepts both "," and "."
 * as the decimal separator. Returns nulls for input that can't be converted.
 */
export function convert(
  amountText: string,
  from: Currency,
  to: Currency,
  rates: RatesTable,
): ConversionResult {
  const amount = parseFloat(amountText.replace(",", "."));
  const fromRate = rates[from];
  const toRate = rates[to];

  if (!Number.isFinite(amount) || !fromRate || !toRate) {
    return { convertedAmount: null, unitRate: null };
  }

  return {
    convertedAmount: (amount / fromRate) * toRate,
    unitRate: toRate / fromRate,
  };
}

interface RatesQueryState {
  hasLiveRates: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

/** Tells the user where the rates on screen come from. */
export function getRatesStatus({
  hasLiveRates,
  isLoading,
  isFetching,
  isError,
}: RatesQueryState): RatesStatus {
  if (isLoading) return "loading";
  // isError can be true while React Query still holds the last good data,
  // so it must be checked before falling through to "live".
  if (isError) return hasLiveRates ? "cached" : "offline-fallback";
  if (isFetching) return "cached";
  return "live";
}

/**
 * Dropdown order: the field's own value first (so it is never buried by
 * history from the other field), then other recently used currencies, then
 * everything else in the default order.
 */
export function orderCurrencies(value: Currency, recent: readonly Currency[]) {
  const pinned: Currency[] = [value];
  for (const code of recent) {
    if (!pinned.includes(code)) pinned.push(code);
  }
  const rest = CURRENCIES.filter((code) => !pinned.includes(code));
  return { orderedCurrencies: [...pinned, ...rest], pinnedCount: pinned.length };
}
