import { formatAmount, formatRate } from "../lib/format";
import styles from "./ResultDisplay.module.css";

interface ResultDisplayProps {
  convertedAmount: number | null;
  unitRate: number | null;
  from: string;
  to: string;
}

export function ResultDisplay({ convertedAmount, unitRate, from, to }: ResultDisplayProps) {
  return (
    <>
      <div className={styles.result}>
        {convertedAmount === null ? "—" : `${formatAmount(convertedAmount)} ${to}`}
      </div>
      <div className={styles.rateInfo}>
        {unitRate === null ? "" : `1 ${from} = ${formatRate(unitRate)} ${to}`}
      </div>
    </>
  );
}
