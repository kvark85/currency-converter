const NBSP = "\u00a0";

// Thousands are separated by spaces: a comma would be read back as a decimal
// separator if the user copied the number into the other field.
function format(value: number, options: Intl.NumberFormatOptions): string {
  return value.toLocaleString("en-US", options).replaceAll(",", NBSP);
}

/** Money amounts: rounded to 2 decimal places, e.g. 11.4474 -> 11.45. */
export function formatAmount(value: number): string {
  return format(value, { maximumFractionDigits: 2 });
}

/** Exchange rates keep more precision so small rates don't collapse to 0. */
export function formatRate(value: number): string {
  return format(
    value,
    value < 1 ? { maximumSignificantDigits: 4 } : { maximumFractionDigits: 4 },
  );
}

/** Groups the integer part of typed text without touching the rest of it. */
export function groupDigits(text: string): string {
  return text.trim().replace(/^\d+/, (digits) => digits.replace(/\B(?=(\d{3})+$)/g, NBSP));
}

/** "today, 14:05" or "22 Nov, 14:05", in the user's time zone. */
export function formatUpdatedAt(timestamp: number, now = new Date()): string {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const day =
    date.toDateString() === now.toDateString()
      ? "today"
      : date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${day}, ${time}`;
}
