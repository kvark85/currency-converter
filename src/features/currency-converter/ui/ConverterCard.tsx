import { useConversion } from "../model/useConversion";
import type { Side } from "../model/converterStore";
import { formatAmount, formatRate } from "../lib/format";
import { MoneyRow } from "./MoneyRow";
import { SwapButton } from "./SwapButton";
import { StatusBar } from "./StatusBar";
import styles from "./ConverterCard.module.css";

const ERROR_ID = "amount-error";

export function ConverterCard() {
  const {
    amount,
    side,
    from,
    to,
    recent,
    computed,
    isInvalid,
    unitRate,
    updatedAt,
    status,
    setAmount,
    setFrom,
    setTo,
    swap,
  } = useConversion();

  function amountProps(row: Side) {
    const isTyped = row === side;
    return {
      typed: isTyped ? amount : null,
      computed,
      errorId: isTyped && isInvalid ? ERROR_ID : undefined,
      recentCurrencies: recent,
      onAmountChange: (value: string) => setAmount(value, row),
    };
  }

  const [typedCurrency, computedCurrency] = side === "from" ? [from, to] : [to, from];

  return (
    <main className={styles.card}>
      <h1 className={styles.title}>Currency Converter</h1>

      <MoneyRow
        id="from"
        label="You have"
        currency={from}
        onCurrencyChange={setFrom}
        {...amountProps("from")}
      />
      <SwapButton onClick={swap} />
      <MoneyRow
        id="to"
        label="You get"
        currency={to}
        onCurrencyChange={setTo}
        {...amountProps("to")}
      />

      {isInvalid && (
        <p id={ERROR_ID} className={styles.error} role="alert">
          Enter a positive number, e.g. 12.50
        </p>
      )}
      <p className={styles.rate}>
        {unitRate === null ? "Rate unavailable" : `1 ${from} = ${formatRate(unitRate)} ${to}`}
      </p>
      <StatusBar status={status} updatedAt={updatedAt} />

      <div className={styles.srOnly} aria-live="polite">
        {computed !== null &&
          `${amount} ${typedCurrency} = ${formatAmount(computed)} ${computedCurrency}`}
      </div>
    </main>
  );
}
