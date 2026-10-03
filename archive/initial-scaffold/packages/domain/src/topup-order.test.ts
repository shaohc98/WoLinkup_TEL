import assert from "node:assert/strict";
import test from "node:test";

import {
  isTerminalTopupOrderStatus,
  transitionTopupOrder,
} from "./topup-order.js";

test("allows the normal paid-to-success path", () => {
  let status = transitionTopupOrder("paid", "routing");
  status = transitionTopupOrder(status, "submitted");
  status = transitionTopupOrder(status, "succeeded");
  assert.equal(status, "succeeded");
  assert.equal(isTerminalTopupOrderStatus(status), true);
});

test("prevents a successful order from returning to processing", () => {
  assert.throws(
    () => transitionTopupOrder("succeeded", "processing"),
    /Illegal top-up order transition/,
  );
});
