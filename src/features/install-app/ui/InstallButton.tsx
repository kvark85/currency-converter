import { useRef } from "react";
import { useInstallStore } from "../model/installStore";
import { IosInstallDialog } from "./IosInstallDialog";
import styles from "./InstallButton.module.css";

export function InstallButton() {
  const mode = useInstallStore((state) => state.mode);
  const promptInstall = useInstallStore((state) => state.promptInstall);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (mode === "none") return null;

  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-haspopup={mode === "ios" ? "dialog" : undefined}
        onClick={() =>
          mode === "ios" ? dialogRef.current?.showModal() : void promptInstall()
        }
      >
        Install app
      </button>
      {mode === "ios" && <IosInstallDialog ref={dialogRef} />}
    </>
  );
}
