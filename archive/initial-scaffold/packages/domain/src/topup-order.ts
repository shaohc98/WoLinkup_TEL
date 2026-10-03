import type { TopupOrderStatus } from "@wolinkup/contracts";

const TRANSITIONS: Readonly<
  Record<TopupOrderStatus, readonly TopupOrderStatus[]>
> = {
  pending_payment: ["payment_processing", "cancelled"],
  payment_processing: ["paid", "pending_payment", "cancelled", "manual_review"],
  paid: ["routing", "refund_pending", "manual_review"],
  routing: ["submitted", "refund_pending", "manual_review"],
  submitted: ["processing", "succeeded", "failed", "manual_review"],
  processing: ["succeeded", "failed", "manual_review"],
  succeeded: [],
  failed: ["refund_pending", "manual_review"],
  refund_pending: ["refunded", "manual_review"],
  refunded: [],
  manual_review: [
    "routing",
    "processing",
    "succeeded",
    "failed",
    "refund_pending",
    "refunded",
  ],
  cancelled: [],
};

export function canTransitionTopupOrder(
  current: TopupOrderStatus,
  next: TopupOrderStatus,
): boolean {
  return TRANSITIONS[current].includes(next);
}

export function transitionTopupOrder(
  current: TopupOrderStatus,
  next: TopupOrderStatus,
): TopupOrderStatus {
  if (!canTransitionTopupOrder(current, next)) {
    throw new Error(`Illegal top-up order transition: ${current} -> ${next}`);
  }
  return next;
}

export function isTerminalTopupOrderStatus(status: TopupOrderStatus): boolean {
  return TRANSITIONS[status].length === 0;
}
