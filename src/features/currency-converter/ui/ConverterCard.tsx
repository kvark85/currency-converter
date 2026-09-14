import { useConversion } from "../model/useConversion";
import { AmountField } from "./AmountField";
import { CurrencyField } from "./CurrencyField";
import { SwapButton } from "./SwapButton";
import { ResultDisplay } from "./ResultDisplay";
import { StatusBar } from "./StatusBar";
import styles from "./ConverterCard.module.css";

export function ConverterCard() {
  const {
    amount,
    from,
    to,
    convertedAmount,
    unitRate,
    status,
    setAmount,
    setFrom,
    setTo,
    swap,
  } = useConversion();

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>💱 Конвертер валют</h1>

      <div className={styles.amountBlock}>
        <AmountField value={amount} onChange={setAmount} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <CurrencyField id="from" label="Из" value={from} onChange={setFrom} />
        </div>
        <SwapButton onClick={swap} />
        <div className={styles.field}>
          <CurrencyField id="to" label="В" value={to} onChange={setTo} />
        </div>
      </div>

      <ResultDisplay convertedAmount={convertedAmount} unitRate={unitRate} from={from} to={to} />
      <StatusBar status={status} />
    </div>
  );
}
