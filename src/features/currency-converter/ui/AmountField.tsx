import type { ChangeEvent } from "react";
import styles from "./AmountField.module.css";

interface AmountFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function AmountField({ value, onChange }: AmountFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div>
      <label className={styles.label} htmlFor="amount">
        Сумма
      </label>
      <input
        id="amount"
        className={styles.input}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
