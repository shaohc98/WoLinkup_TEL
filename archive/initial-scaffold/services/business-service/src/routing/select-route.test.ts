import assert from "node:assert/strict";
import test from "node:test";

import { selectRoute, type RouteCandidate } from "./select-route.js";

const base: RouteCandidate = {
  supplierId: "supplier-a",
  supplierSkuId: "sku-a",
  enabled: true,
  healthy: true,
  balanceSufficient: true,
  costMinor: 100n,
  successRateBasisPoints: 9_800,
  p95LatencyMs: 1_000,
  manualPriority: 10,
};

test("removes unhealthy routes before ranking", () => {
  const decision = selectRoute(
    [
      {
        ...base,
        supplierId: "supplier-unhealthy",
        healthy: false,
        costMinor: 1n,
      },
      base,
    ],
    "route-policy-v1",
    "2026-09-25T00:00:00.000Z",
  );
  assert.equal(decision.selected.supplierId, "supplier-a");
});

test("uses stable tie breakers", () => {
  const decision = selectRoute(
    [base, { ...base, supplierId: "supplier-b", costMinor: 90n }],
    "route-policy-v1",
  );
  assert.equal(decision.selected.supplierId, "supplier-b");
});
