import type { RatesStatus } from "../model/useConversion";
import styles from "./StatusBar.module.css";

const STATUS_TEXT: Record<RatesStatus, string> = {
  loading: "Загрузка курсов…",
  live: "Курсы обновлены",
  cached: "Курсы из кэша (обновляются раз в час)",
  "offline-fallback": "Нет соединения — используются приблизительные курсы",
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
