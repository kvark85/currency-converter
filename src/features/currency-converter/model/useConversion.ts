import { useConverterStore } from "./converterStore";
import { useRatesQuery } from "./useRatesQuery";
import { FALLBACK_RATES_USD } from "../api/ratesApi";
import { getRatesStatus, getUnitRate, parseAmount } from "../lib/conversion";

export type { RatesStatus } from "../lib/conversion";

export function useConversion() {
  const state = useConverterStore();
  const { data, isPending, isFetching, isError, isPaused } = useRatesQuery();

  const { amount, side, from, to } = state;
  const unitRate = getUnitRate(from, to, data?.rates ?? FALLBACK_RATES_USD);
  const typed = parseAmount(amount);
  const computed =
    typed === null || unitRate === null
      ? null
      : side === "from"
        ? typed * unitRate
        : typed / unitRate;

  return {
    ...state,
    /** Value for the side the user is not typing into. */
    computed,
    isInvalid: typed === null && amount.trim() !== "",
    unitRate,
    updatedAt: data?.updatedAt ?? null,
    status: getRatesStatus({
      hasLiveRates: !!data,
      isLoading: isPending,
      isFetching,
      // A paused request means the device is offline.
      isError: isError || isPaused,
    }),
  };
}
