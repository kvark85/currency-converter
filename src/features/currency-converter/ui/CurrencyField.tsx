import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CURRENCY_FLAGS, CURRENCY_NAMES, type Currency } from "../lib/currencies";
import { orderCurrencies } from "../lib/conversion";
import styles from "./CurrencyField.module.css";

interface CurrencyFieldProps {
  id: string;
  /** Accessible name; the value is appended to it. */
  label: string;
  value: Currency;
  /** Most-recently-used currencies (shared with the other field), most recent first. */
  recentCurrencies: Currency[];
  onChange: (value: Currency) => void;
}

/**
 * A custom dropdown (ARIA "collapsible listbox" pattern) instead of a
 * native <select> — native <option> elements can only render text, so
 * there is no way to show a flag icon next to each currency inside a
 * plain <select>.
 */
export function CurrencyField({ id, label, value, recentCurrencies, onChange }: CurrencyFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const { orderedCurrencies, pinnedCount } = useMemo(
    () => orderCurrencies(value, recentCurrencies),
    [value, recentCurrencies],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      listRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen, id]);

  function open() {
    setActiveIndex(orderedCurrencies.indexOf(value));
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function select(index: number) {
    const next = orderedCurrencies[index];
    if (next) onChange(next);
    close();
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, orderedCurrencies.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(orderedCurrencies.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`${label}: ${value}, ${CURRENCY_NAMES[value]}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        <img className={styles.flag} src={CURRENCY_FLAGS[value]} alt="" />
        <span>{value}</span>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          className={styles.listbox}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={handleListKeyDown}
        >
          {orderedCurrencies.map((code, index) => (
            <li
              key={code}
              id={optionId(index)}
              role="option"
              aria-selected={code === value}
              className={[
                styles.option,
                index === activeIndex && styles.optionActive,
                index === pinnedCount &&
                  pinnedCount > 1 &&
                  pinnedCount < orderedCurrencies.length &&
                  styles.optionDivider,
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(index)}
            >
              <img className={styles.flag} src={CURRENCY_FLAGS[code]} alt="" />
              <span>{code}</span>
              <span className={styles.name}>{CURRENCY_NAMES[code]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
