import { useRef } from "react";
import { useInstallStore } from "../model/installStore";
import { IosInstallDialog } from "./IosInstallDialog";
import styles from "./InstallButton.module.css";

export function InstallButton() {
  const mode = useInstallStore((state) => state.mode);
  const isDismissed = useInstallStore((state) => state.isDismissed);
  const dismiss = useInstallStore((state) => state.dismiss);
  const promptInstall = useInstallStore((state) => state.promptInstall);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (mode === "none" || isDismissed) return null;

  return (
    <div className={styles.bar}>
      <button
        type="button"
        className={styles.button}
        aria-haspopup={mode === "ios" ? "dialog" : undefined}
        onClick={() =>
          mode === "ios" ? dialogRef.current?.showModal() : void promptInstall()
        }
      >
        Install app <span className={styles.hint}>· works offline</span>
      </button>
      <button
        type="button"
        className={styles.dismiss}
        aria-label="Hide install button"
        onClick={dismiss}
      >
        ✕
      </button>
      {mode === "ios" && <IosInstallDialog ref={dialogRef} />}
    </div>
  );
}
