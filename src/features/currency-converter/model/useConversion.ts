import { useMemo } from "react";
import { useConverterStore } from "./converterStore";
import { useRatesQuery } from "./useRatesQuery";
import { FALLBACK_RATES_USD } from "../api/ratesApi";
import { convert, getRatesStatus } from "../lib/conversion";

export type { RatesStatus } from "../lib/conversion";

export function useConversion() {
  const { amount, from, to, recent, setAmount, setFrom, setTo, swap } = useConverterStore();
  const { data: liveRates, isLoading, isFetching, isError } = useRatesQuery();

  const rates = liveRates ?? FALLBACK_RATES_USD;

  const status = getRatesStatus({ hasLiveRates: !!liveRates, isLoading, isFetching, isError });

  const { convertedAmount, unitRate } = useMemo(
    () => convert(amount, from, to, rates),
    [amount, from, to, rates],
  );

  return {
    amount,
    from,
    to,
    recent,
    convertedAmount,
    unitRate,
    status,
    setAmount,
    setFrom,
    setTo,
    swap,
  };
}
