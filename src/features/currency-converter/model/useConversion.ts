import { useMemo } from "react";
import { useConverterStore } from "./converterStore";
import { useRatesQuery } from "./useRatesQuery";
import { FALLBACK_RATES_USD } from "../api/ratesApi";

export type RatesStatus = "loading" | "live" | "cached" | "offline-fallback";

export function useConversion() {
  const { amount, from, to, setAmount, setFrom, setTo, swap } = useConverterStore();
  const { data: liveRates, isLoading, isFetching, isError } = useRatesQuery();

  const rates = liveRates ?? FALLBACK_RATES_USD;

  const status: RatesStatus = useMemo(() => {
    if (isLoading) return "loading";
    // isError can be true even while stale data from a previous successful
    // fetch is still in `liveRates` (React Query keeps last-good data) — so
    // this must be checked before falling through to "live".
    if (isError) return liveRates ? "cached" : "offline-fallback";
    if (isFetching) return "cached";
    return "live";
  }, [liveRates, isError, isLoading, isFetching]);

  const { convertedAmount, unitRate } = useMemo(() => {
    const numericAmount = parseFloat(amount.replace(",", "."));
    const fromRate = rates[from];
    const toRate = rates[to];

    if (!Number.isFinite(numericAmount) || !fromRate || !toRate) {
      return { convertedAmount: null, unitRate: null };
    }

    const amountInUsd = numericAmount / fromRate;
    return {
      convertedAmount: amountInUsd * toRate,
      unitRate: toRate / fromRate,
    };
  }, [amount, from, to, rates]);

  return {
    amount,
    from,
    to,
    convertedAmount,
    unitRate,
    status,
    setAmount,
    setFrom,
    setTo,
    swap,
  };
}
