import { CURRENCIES, type Currency } from "./currencies";
import type { RatesTable } from "../api/ratesApi";

export type RatesStatus = "loading" | "live" | "updating" | "cached" | "offline-fallback";

/** Units of `to` per one unit of `from`. All rates are relative to USD. */
export function getUnitRate(from: Currency, to: Currency, rates: RatesTable): number | null {
  const fromRate = rates[from];
  const toRate = rates[to];
  return fromRate && toRate ? toRate / fromRate : null;
}

/**
 * Parses an amount typed by the user. Accepts both "," and "." as the decimal
 * separator and spaces between thousands; when both "," and "." are present
 * (pasted text), the last one is the decimal separator. Null if not a number.
 */
export function parseAmount(text: string): number | null {
  let clean = text.replace(/\s/g, "");
  if (clean.includes(",") && clean.includes(".")) {
    const thousands = clean.lastIndexOf(",") > clean.lastIndexOf(".") ? "." : ",";
    clean = clean.replaceAll(thousands, "");
  }
  clean = clean.replace(",", ".");
  if (!/^(\d+\.?\d*|\.\d+)$/.test(clean)) return null;
  const amount = Number(clean);
  return Number.isFinite(amount) ? amount : null;
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
  // isError can be true while React Query still holds the last good data,
  // so it must be checked before falling through to "live".
  if (isError) return hasLiveRates ? "cached" : "offline-fallback";
  if (isLoading) return "loading";
  if (isFetching) return "updating";
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
