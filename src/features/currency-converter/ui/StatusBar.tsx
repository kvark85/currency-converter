import { formatUpdatedAt } from "../lib/format";
import type { RatesStatus } from "../model/useConversion";
import styles from "./StatusBar.module.css";

interface StatusBarProps {
  status: RatesStatus;
  updatedAt: number | null;
}

function getText({ status, updatedAt }: StatusBarProps): string {
  const when = updatedAt === null ? null : formatUpdatedAt(updatedAt);
  switch (status) {
    case "loading":
      return "Approximate rates · loading current ones…";
    case "updating":
      return "Updating rates…";
    case "live":
      return when ? `Rates from ${when}` : "Rates up to date";
    case "cached":
      return when ? `Couldn’t update · rates from ${when}` : "Couldn’t update · using saved rates";
    case "offline-fallback":
      return "⚠ No connection. Rates are approximate and may be out of date";
  }
}

export function StatusBar(props: StatusBarProps) {
  const modifier = { "offline-fallback": styles.error, cached: styles.warn }[
    props.status as string
  ];
  return <div className={[styles.status, modifier].filter(Boolean).join(" ")}>{getText(props)}</div>;
}
