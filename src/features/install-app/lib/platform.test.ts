import { describe, expect, it } from "vitest";
import { isIos } from "./platform";

const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15";

describe("isIos", () => {
  it("detects an iPhone", () => {
    const userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)";
    expect(isIos({ userAgent, maxTouchPoints: 5 })).toBe(true);
  });

  it("detects an iPad that reports itself as a Mac", () => {
    expect(isIos({ userAgent: MAC, maxTouchPoints: 5 })).toBe(true);
  });

  it("does not match a real Mac", () => {
    expect(isIos({ userAgent: MAC, maxTouchPoints: 0 })).toBe(false);
  });

  it("does not match Android", () => {
    const userAgent = "Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/140.0 Mobile";
    expect(isIos({ userAgent, maxTouchPoints: 5 })).toBe(false);
  });
});
