import { useEffect, useRef, useState } from "react";
import { formatAmount, groupDigits } from "../lib/format";
import type { Currency } from "../lib/currencies";
import { CurrencyField } from "./CurrencyField";
import styles from "./MoneyRow.module.css";

interface MoneyRowProps {
  id: string;
  label: string;
  /** Text typed by the user, or null when this row shows the computed value. */
  typed: string | null;
  computed: number | null;
  errorId?: string;
  currency: Currency;
  recentCurrencies: Currency[];
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: Currency) => void;
}

export function MoneyRow({
  id,
  label,
  typed,
  computed,
  errorId,
  currency,
  recentCurrencies,
  onAmountChange,
  onCurrencyChange,
}: MoneyRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectOnClick = useRef(false);
  const [isFocused, setIsFocused] = useState(false);

  const text = typed ?? (computed === null ? "" : formatAmount(computed));
  // Grouping is dropped while editing so the caret doesn't jump around.
  const value = isFocused ? text.replaceAll("\u00a0", "") : groupDigits(text);

  // After render, because ungrouping the value on focus resets the selection.
  useEffect(() => {
    if (isFocused) inputRef.current?.select();
  }, [isFocused]);

  return (
    <div className={styles.row}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.controls}>
        <input
          ref={inputRef}
          id={id}
          className={value.length > 9 ? `${styles.input} ${styles.long}` : styles.input}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={value}
          aria-invalid={errorId !== undefined}
          aria-describedby={errorId}
          onChange={(event) => onAmountChange(event.target.value)}
          onMouseDown={() => {
            selectOnClick.current = !isFocused;
          }}
          onClick={() => {
            // The first click places a caret and loses the selection; restore it.
            if (selectOnClick.current) inputRef.current?.select();
            selectOnClick.current = false;
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <CurrencyField
          id={`${id}-currency`}
          label={`${label}, currency`}
          value={currency}
          recentCurrencies={recentCurrencies}
          onChange={onCurrencyChange}
        />
      </div>
    </div>
  );
}
