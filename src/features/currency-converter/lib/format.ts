export function formatAmount(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}
