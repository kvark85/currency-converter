type NavigatorInfo = Pick<Navigator, "userAgent" | "maxTouchPoints">;

/** iPadOS reports itself as a Mac, so a Mac with a touch screen counts as an iPad. */
export function isIos({ userAgent, maxTouchPoints }: NavigatorInfo): boolean {
  return (
    /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1)
  );
}

/** True when the page was launched from the home screen rather than in a browser tab. */
export function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari-only flag, missing from the standard DOM typings.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
