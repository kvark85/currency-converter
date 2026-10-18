interface CurrencyInfo {
  code: string;
  countryCode: string;
}

// countryCode is the ISO 3166-1 alpha-2 code used to look up the matching
// SVG in public/flags/ (sourced from flagcdn.com), e.g. "us" -> /flags/us.svg
const CURRENCY_INFO = [
  { code: "USD", countryCode: "us" },
  { code: "EUR", countryCode: "eu" },
  { code: "RUB", countryCode: "ru" },
  { code: "GBP", countryCode: "gb" },
  { code: "JPY", countryCode: "jp" },
  { code: "CNY", countryCode: "cn" },
  { code: "CHF", countryCode: "ch" },
  { code: "KZT", countryCode: "kz" },
  { code: "UAH", countryCode: "ua" },
  { code: "PLN", countryCode: "pl" },
  { code: "TRY", countryCode: "tr" },
  { code: "AED", countryCode: "ae" },
  { code: "GEL", countryCode: "ge" },
] as const satisfies readonly CurrencyInfo[];

export type Currency = (typeof CURRENCY_INFO)[number]["code"];

export const CURRENCIES: readonly Currency[] = CURRENCY_INFO.map((c) => c.code);

export const CURRENCY_FLAGS: Record<Currency, string> = Object.fromEntries(
  CURRENCY_INFO.map((c) => [c.code, `${import.meta.env.BASE_URL}flags/${c.countryCode}.svg`]),
) as Record<Currency, string>;

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}
