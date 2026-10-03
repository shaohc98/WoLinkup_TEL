import { describe, expect, it } from "vitest";

import { e164Schema, moneySchema } from "./index.js";

describe("shared boundary validation", () => {
  it("accepts decimal money without floating point coercion", () => {
    expect(moneySchema.parse({ amount: "100.00", currency: "CNY" })).toEqual({
      amount: "100.00",
      currency: "CNY",
    });
  });

  it("rejects a local phone number at the service boundary", () => {
    expect(() => e164Schema.parse("13800138000")).toThrow();
  });
});
