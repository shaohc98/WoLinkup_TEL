import assert from "node:assert/strict";
import test from "node:test";

import { Money } from "./money.js";

test("parses decimal money without floating-point arithmetic", () => {
  assert.deepEqual(Money.fromDecimal("12.30", "CNY").toDto(), {
    amountMinor: "1230",
    currency: "CNY",
    exponent: 2,
  });
});

test("rejects excess decimal places", () => {
  assert.throws(
    () => Money.fromDecimal("1.001", "USD"),
    /more than 2 decimal places/,
  );
});

test("rounds basis-point calculations to the nearest minor unit", () => {
  assert.equal(
    Money.fromMinor(10_005n, "CNY").multiplyBasisPoints(300).amountMinor,
    300n,
  );
});
