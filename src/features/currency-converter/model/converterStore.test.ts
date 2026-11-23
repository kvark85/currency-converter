// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { useConverterStore } from "./converterStore";

const STORAGE_KEY = "currency-converter:selection";
const initialState = useConverterStore.getState();

beforeEach(() => {
  localStorage.clear();
  useConverterStore.setState(initialState, true);
});

describe("converterStore", () => {
  it("swaps the 'from' and 'to' currencies", () => {
    useConverterStore.getState().swap();

    const { from, to } = useConverterStore.getState();
    expect([from, to]).toEqual(["EUR", "USD"]);
  });

  it("does not count the default currencies as recently used", () => {
    expect(useConverterStore.getState().recent).toEqual([]);
  });

  it("tracks recently used currencies, most recent first, without duplicates", () => {
    const { setFrom, setTo } = useConverterStore.getState();
    setFrom("PLN");
    setTo("JPY");
    setFrom("PLN");

    expect(useConverterStore.getState().recent).toEqual(["PLN", "JPY"]);
  });

  it("keeps at most 4 recent currencies", () => {
    const { setFrom } = useConverterStore.getState();
    (["PLN", "JPY", "GBP", "CHF", "UAH"] as const).forEach(setFrom);

    expect(useConverterStore.getState().recent).toEqual(["UAH", "CHF", "GBP", "JPY"]);
  });

  it("persists the selection to localStorage", () => {
    useConverterStore.getState().setAmount("250", "to");

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(saved.state).toMatchObject({ amount: "250", side: "to", from: "USD", to: "EUR" });
  });

  it("ignores unknown currencies when restoring saved state", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { amount: "5", from: "XXX", to: "PLN", recent: ["BTC", "PLN"] }, version: 0 }),
    );

    await useConverterStore.persist.rehydrate();

    const { amount, from, to, recent } = useConverterStore.getState();
    expect({ amount, from, to, recent }).toEqual({ amount: "5", from: "USD", to: "PLN", recent: ["PLN"] });
  });
});
