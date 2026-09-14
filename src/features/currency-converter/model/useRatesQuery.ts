import { useQuery } from "@tanstack/react-query";
import { fetchRates } from "../api/ratesApi";

const ONE_HOUR = 1000 * 60 * 60;

/**
 * Server state for exchange rates. Persisted to storage by the
 * QueryProvider (see app/providers), so a previous response is available
 * immediately on reload even without a network connection.
 */
export function useRatesQuery() {
  return useQuery({
    queryKey: ["rates", "USD"],
    queryFn: ({ signal }) => fetchRates(signal),
    staleTime: ONE_HOUR,
    gcTime: ONE_HOUR * 24,
    retry: 2,
  });
}
