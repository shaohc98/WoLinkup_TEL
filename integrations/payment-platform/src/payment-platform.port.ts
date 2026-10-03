export type PaymentStatusProjection =
  "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "UNKNOWN";

export type CreatePaymentSessionCommand = {
  readonly amount: string;
  readonly currency: string;
  readonly idempotencyKey: string;
  readonly orderId: string;
  readonly returnUrl: string;
  readonly siteId: string;
};

export type PaymentSession = {
  readonly expiresAt: string;
  readonly platformPaymentId: string;
  readonly redirectUrl: string;
  readonly status: PaymentStatusProjection;
};

export type RequestRefundCommand = {
  readonly amount: string;
  readonly currency: string;
  readonly idempotencyKey: string;
  readonly paymentPlatformId: string;
  readonly refundOrderId: string;
};

export type RefundExecution = {
  readonly platformRefundId: string;
  readonly status: "PROCESSING" | "SUCCEEDED" | "FAILED" | "UNKNOWN";
};

export interface PaymentPlatformPort {
  createSession(command: CreatePaymentSessionCommand): Promise<PaymentSession>;
  getPayment(paymentPlatformId: string): Promise<PaymentSession>;
  getRefund(platformRefundId: string): Promise<RefundExecution>;
  requestRefund(command: RequestRefundCommand): Promise<RefundExecution>;
}
