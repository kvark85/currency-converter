import type { ChangeEvent } from "react";
import { CURRENCIES, type Currency, isCurrency } from "../lib/currencies";
import styles from "./CurrencyField.module.css";

interface CurrencyFieldProps {
  id: string;
  label: string;
  value: Currency;
  onChange: (value: Currency) => void;
}

export function CurrencyField({ id, label, value, onChange }: CurrencyFieldProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    if (isCurrency(next)) {
      onChange(next);
    }
  }

  return (
    <div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={styles.select} value={value} onChange={handleChange}>
        {CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </div>
  );
}
