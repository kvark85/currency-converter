export function formatAmount(value: number): string {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 4 });
}
