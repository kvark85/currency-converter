import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Currency, isCurrency } from "../lib/currencies";

const MAX_RECENT = 4;

function touch(recent: Currency[], code: Currency): Currency[] {
  return [code, ...recent.filter((c) => c !== code)].slice(0, MAX_RECENT);
}

interface ConverterState {
  amount: string;
  from: Currency;
  to: Currency;
  /** Most-recently-used currencies first, shared between both fields. */
  recent: Currency[];
  setAmount: (amount: string) => void;
  setFrom: (currency: Currency) => void;
  setTo: (currency: Currency) => void;
  swap: () => void;
}

/**
 * Client-side UI state only (amount, selected currencies). Server data
 * (exchange rates) lives in TanStack Query, not here — the two are kept
 * separate on purpose so each can be cached/persisted independently.
 */
export const useConverterStore = create<ConverterState>()(
  persist(
    (set) => ({
      amount: "100",
      from: "USD",
      to: "EUR",
      recent: ["USD", "EUR"],
      setAmount: (amount) => set({ amount }),
      setFrom: (from) => set((state) => ({ from, recent: touch(state.recent, from) })),
      setTo: (to) => set((state) => ({ to, recent: touch(state.recent, to) })),
      swap: () => set((state) => ({ from: state.to, to: state.from })),
    }),
    {
      name: "currency-converter:selection",
      partialize: (state) => ({
        amount: state.amount,
        from: state.from,
        to: state.to,
        recent: state.recent,
      }),
      merge: (persisted, current) => {
        const saved = persisted as
          | Partial<Pick<ConverterState, "amount" | "from" | "to" | "recent">>
          | undefined;
        const recent = Array.isArray(saved?.recent)
          ? saved.recent.filter(isCurrency).slice(0, MAX_RECENT)
          : current.recent;
        return {
          ...current,
          ...saved,
          from: saved?.from && isCurrency(saved.from) ? saved.from : current.from,
          to: saved?.to && isCurrency(saved.to) ? saved.to : current.to,
          recent,
        };
      },
    },
  ),
);
