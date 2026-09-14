import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Currency, isCurrency } from "../lib/currencies";

interface ConverterState {
  amount: string;
  from: Currency;
  to: Currency;
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
      setAmount: (amount) => set({ amount }),
      setFrom: (from) => set({ from }),
      setTo: (to) => set({ to }),
      swap: () => set((state) => ({ from: state.to, to: state.from })),
    }),
    {
      name: "currency-converter:selection",
      partialize: (state) => ({
        amount: state.amount,
        from: state.from,
        to: state.to,
      }),
      merge: (persisted, current) => {
        const saved = persisted as
          | Partial<Pick<ConverterState, "amount" | "from" | "to">>
          | undefined;
        return {
          ...current,
          ...saved,
          from: saved?.from && isCurrency(saved.from) ? saved.from : current.from,
          to: saved?.to && isCurrency(saved.to) ? saved.to : current.to,
        };
      },
    },
  ),
);
