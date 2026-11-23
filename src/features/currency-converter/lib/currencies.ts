interface CurrencyInfo {
  code: string;
  name: string;
  countryCode: string;
}

// countryCode is the ISO 3166-1 alpha-2 code used to look up the matching
// SVG in public/flags/ (sourced from flagcdn.com), e.g. "us" -> /flags/us.svg
const CURRENCY_INFO = [
  { code: "USD", name: "US Dollar", countryCode: "us" },
  { code: "EUR", name: "Euro", countryCode: "eu" },
  { code: "RUB", name: "Russian Ruble", countryCode: "ru" },
  { code: "GBP", name: "British Pound", countryCode: "gb" },
  { code: "JPY", name: "Japanese Yen", countryCode: "jp" },
  { code: "CNY", name: "Chinese Yuan", countryCode: "cn" },
  { code: "CHF", name: "Swiss Franc", countryCode: "ch" },
  { code: "KZT", name: "Kazakhstani Tenge", countryCode: "kz" },
  { code: "UAH", name: "Ukrainian Hryvnia", countryCode: "ua" },
  { code: "PLN", name: "Polish Zloty", countryCode: "pl" },
  { code: "TRY", name: "Turkish Lira", countryCode: "tr" },
  { code: "AED", name: "UAE Dirham", countryCode: "ae" },
  { code: "GEL", name: "Georgian Lari", countryCode: "ge" },
] as const satisfies readonly CurrencyInfo[];

export type Currency = (typeof CURRENCY_INFO)[number]["code"];

export const CURRENCIES: readonly Currency[] = CURRENCY_INFO.map((c) => c.code);

export const CURRENCY_FLAGS: Record<Currency, string> = Object.fromEntries(
  CURRENCY_INFO.map((c) => [c.code, `${import.meta.env.BASE_URL}flags/${c.countryCode}.svg`]),
) as Record<Currency, string>;

export const CURRENCY_NAMES = Object.fromEntries(
  CURRENCY_INFO.map((c) => [c.code, c.name]),
) as Record<Currency, string>;

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}
