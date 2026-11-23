import { describe, expect, it } from "vitest";
import { formatAmount, formatRate, formatUpdatedAt, groupDigits } from "./format";

describe("formatAmount", () => {
  it("rounds money to 2 decimal places", () => {
    expect(formatAmount(11.4474)).toBe("11.45");
  });

  it("adds thousands separators", () => {
    expect(formatAmount(1234567.891)).toBe("1\u00a0234\u00a0567.89");
  });

  it("does not add trailing zeros", () => {
    expect(formatAmount(10)).toBe("10");
  });
});

describe("formatRate", () => {
  it("keeps 4 significant digits so small rates don't collapse to 0", () => {
    expect(formatRate(0.006712)).toBe("0.006712");
  });
});

describe("groupDigits", () => {
  it("groups the integer part and keeps the typed decimals", () => {
    expect(groupDigits("1234567,8900")).toBe("1\u00a0234\u00a0567,8900");
    expect(groupDigits("100")).toBe("100");
  });
});

describe("formatUpdatedAt", () => {
  const now = new Date(2026, 10, 23, 18, 0);

  it("says 'today' for the current day", () => {
    expect(formatUpdatedAt(new Date(2026, 10, 23, 9, 5).getTime(), now)).toBe("today, 09:05");
  });

  it("shows the date for earlier days", () => {
    expect(formatUpdatedAt(new Date(2026, 10, 22, 9, 5).getTime(), now)).toBe("22 Nov, 09:05");
  });
});
