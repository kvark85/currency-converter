import { describe, expect, it } from "vitest";
import { formatAmount, formatRate } from "./format";

describe("formatAmount", () => {
  it("rounds money to 2 decimal places", () => {
    expect(formatAmount(11.4474)).toBe("11.45");
  });

  it("adds thousands separators", () => {
    expect(formatAmount(1234567.891)).toBe("1,234,567.89");
  });

  it("does not add trailing zeros", () => {
    expect(formatAmount(10)).toBe("10");
  });
});

describe("formatRate", () => {
  it("keeps 4 decimal places so small rates don't collapse to 0", () => {
    expect(formatRate(0.006712)).toBe("0.0067");
  });
});
