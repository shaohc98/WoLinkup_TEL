export interface RouteCandidate {
  supplierId: string;
  supplierSkuId: string;
  enabled: boolean;
  healthy: boolean;
  balanceSufficient: boolean;
  costMinor: bigint;
  successRateBasisPoints: number;
  p95LatencyMs: number;
  manualPriority: number;
}

export interface RouteDecision {
  selected: RouteCandidate;
  eligibleSupplierIds: string[];
  decidedAt: string;
  policyVersion: string;
}

export function selectRoute(
  candidates: readonly RouteCandidate[],
  policyVersion: string,
  decidedAt = new Date().toISOString(),
): RouteDecision {
  const eligible = candidates.filter(
    (candidate) =>
      candidate.enabled && candidate.healthy && candidate.balanceSufficient,
  );
  if (eligible.length === 0) throw new Error("No eligible supplier route");

  const ranked = [...eligible].sort((left, right) => {
    if (left.manualPriority !== right.manualPriority) {
      return right.manualPriority - left.manualPriority;
    }
    if (left.successRateBasisPoints !== right.successRateBasisPoints) {
      return right.successRateBasisPoints - left.successRateBasisPoints;
    }
    if (left.costMinor !== right.costMinor)
      return left.costMinor < right.costMinor ? -1 : 1;
    if (left.p95LatencyMs !== right.p95LatencyMs)
      return left.p95LatencyMs - right.p95LatencyMs;
    return left.supplierId.localeCompare(right.supplierId);
  });

  const selected = ranked[0];
  if (!selected) throw new Error("Route ranking returned no result");

  return {
    selected,
    eligibleSupplierIds: ranked.map((candidate) => candidate.supplierId),
    decidedAt,
    policyVersion,
  };
}
