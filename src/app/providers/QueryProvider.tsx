import { type ReactNode, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * Persists the React Query cache (exchange rates) to localStorage so the
 * last known rates survive a full offline reload, not just an in-memory
 * remount — this is what makes the installed PWA usable with no network.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: "offlineFirst",
          },
        },
      }),
  );

  const [persister] = useState(() =>
    createSyncStoragePersister({
      storage: window.localStorage,
      key: "currency-converter:query-cache",
    }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: ONE_DAY }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
