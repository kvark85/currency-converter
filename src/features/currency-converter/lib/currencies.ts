export const CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "GBP",
  "JPY",
  "CNY",
  "CHF",
  "KZT",
  "UAH",
  "PLN",
  "TRY",
  "AED",
  "GEL",
] as const;

export type Currency = (typeof CURRENCIES)[number];

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}
