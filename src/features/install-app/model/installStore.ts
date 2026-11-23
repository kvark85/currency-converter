import { create } from "zustand";
import { isIos, isStandalone } from "../lib/platform";

/** Chromium-only event, missing from the standard DOM typings. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<unknown>;
}

/** How this device can install the app: native prompt, manual iOS steps, or not at all. */
export type InstallMode = "prompt" | "ios" | "none";

const DISMISSED_KEY = "currency-converter:install-dismissed";

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false; // storage is blocked
  }
}

interface InstallState {
  isDismissed: boolean;
  dismiss: () => void;
  mode: InstallMode;
  promptEvent: BeforeInstallPromptEvent | null;
  promptInstall: () => Promise<void>;
}

export const useInstallStore = create<InstallState>()((set, get) => ({
  isDismissed: readDismissed(),
  dismiss: () => {
    set({ isDismissed: true });
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Storage is blocked: the button stays hidden until the next reload.
    }
  },
  mode: !isStandalone() && isIos(navigator) ? "ios" : "none",
  promptEvent: null,
  promptInstall: async () => {
    const { promptEvent } = get();
    if (!promptEvent) return;
    // The event is single-use. If the user declines, the button comes back
    // when the browser fires a new one.
    set({ mode: "none", promptEvent: null });
    await promptEvent.prompt();
  },
}));

// Subscribed at module load, not in an effect: the browser may fire the event
// before React mounts. It is never fired once the app is already installed.
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  if (isStandalone()) return;
  useInstallStore.setState({
    mode: "prompt",
    promptEvent: event as BeforeInstallPromptEvent,
  });
});

window.addEventListener("appinstalled", () => {
  useInstallStore.setState({ mode: "none", promptEvent: null });
});
