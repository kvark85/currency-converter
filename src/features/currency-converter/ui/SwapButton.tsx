import styles from "./SwapButton.module.css";

interface SwapButtonProps {
  onClick: () => void;
}

export function SwapButton({ onClick }: SwapButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      title="Swap currencies"
      aria-label="Swap currencies"
    >
      ⇄
    </button>
  );
}
