import type { RefObject } from "react";
import styles from "./IosInstallDialog.module.css";

interface IosInstallDialogProps {
  ref: RefObject<HTMLDialogElement | null>;
}

function ShareIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15V3m0 0L8 7m4-4 4 4M8 10H5v11h14V10h-3" />
    </svg>
  );
}

/** iOS has no install API, so the best we can do is show the manual steps. */
export function IosInstallDialog({ ref }: IosInstallDialogProps) {
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="ios-install-title"
      onClick={(event) => {
        // The content fills the dialog, so only backdrop taps hit it directly.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className={styles.content}>
        <h2 id="ios-install-title" className={styles.title}>
          Install on your Home Screen
        </h2>
        <ol className={styles.steps}>
          <li>
            Tap <strong>Share</strong> <ShareIcon /> in the browser toolbar. If you don’t see it,
            tap <strong>•••</strong> first.
          </li>
          <li>
            Scroll down and choose <strong>Add to Home Screen</strong>. If it’s hidden, tap{" "}
            <strong>More</strong> first.
          </li>
          <li>
            Tap <strong>Add</strong>.
          </li>
        </ol>
        <p className={styles.note}>No such option? Open this page in Safari and try again.</p>
        <form method="dialog">
          <button type="submit" className={styles.close}>
            Got it
          </button>
        </form>
      </div>
    </dialog>
  );
}
