function format(value: number, maximumFractionDigits: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits });
}

/** Money amounts: rounded to 2 decimal places, e.g. 11.4474 -> 11.45. */
export function formatAmount(value: number): string {
  return format(value, 2);
}

/** Exchange rates keep more precision so small rates don't collapse to 0. */
export function formatRate(value: number): string {
  return format(value, 4);
}
