// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)";

async function loadStore({ standalone = false, userAgent = "Android" } = {}) {
  vi.stubGlobal("matchMedia", () => ({ matches: standalone }));
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent);
  return (await import("./installStore")).useInstallStore;
}

function firePrompt() {
  const prompt = vi.fn().mockResolvedValue(undefined);
  const event = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), { prompt });
  window.dispatchEvent(event);
  return { event, prompt };
}

describe("installStore", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("offers nothing until the browser says the app is installable", async () => {
    const store = await loadStore();
    expect(store.getState().mode).toBe("none");
  });

  it("opens the native prompt once and then hides the button", async () => {
    const store = await loadStore();
    const { event, prompt } = firePrompt();
    expect(event.defaultPrevented).toBe(true);
    expect(store.getState().mode).toBe("prompt");

    await store.getState().promptInstall();
    await store.getState().promptInstall();
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(store.getState().mode).toBe("none");
  });

  it("offers the install again after the browser re-fires the event", async () => {
    const store = await loadStore();
    firePrompt();
    await store.getState().promptInstall();
    firePrompt();
    expect(store.getState().mode).toBe("prompt");
  });

  it("hides the button when the app gets installed", async () => {
    const store = await loadStore();
    firePrompt();
    window.dispatchEvent(new Event("appinstalled"));
    expect(store.getState().mode).toBe("none");
  });

  it("offers manual steps on iOS", async () => {
    const store = await loadStore({ userAgent: IPHONE });
    expect(store.getState().mode).toBe("ios");
  });

  it("offers nothing when launched from the home screen", async () => {
    const store = await loadStore({ standalone: true, userAgent: IPHONE });
    expect(store.getState().mode).toBe("none");
    firePrompt();
    expect(store.getState().mode).toBe("none");
  });
});
