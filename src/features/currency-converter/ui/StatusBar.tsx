import type { RatesStatus } from "../model/useConversion";
import styles from "./StatusBar.module.css";

const STATUS_TEXT: Record<RatesStatus, string> = {
  loading: "Loading rates…",
  live: "Rates up to date",
  cached: "Rates from cache (refreshed hourly)",
  "offline-fallback": "No connection — using approximate rates",
};

export function StatusBar({ status }: { status: RatesStatus }) {
  const className =
    status === "offline-fallback"
      ? `${styles.status} ${styles.error}`
      : status === "cached"
        ? `${styles.status} ${styles.warn}`
        : styles.status;

  return <div className={className}>{STATUS_TEXT[status]}</div>;
}
