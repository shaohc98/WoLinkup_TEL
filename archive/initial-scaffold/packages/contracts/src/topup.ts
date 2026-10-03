import type { MoneyDto } from "./money.js";

export type TopupOrderStatus =
  | "pending_payment"
  | "payment_processing"
  | "paid"
  | "routing"
  | "submitted"
  | "processing"
  | "succeeded"
  | "failed"
  | "refund_pending"
  | "refunded"
  | "manual_review"
  | "cancelled";

export type PaymentStatus =
  | "created"
  | "authorizing"
  | "captured"
  | "failed"
  | "cancelled"
  | "partially_refunded"
  | "refunded";

export type FulfillmentAttemptStatus =
  | "created"
  | "submitted"
  | "accepted"
  | "processing"
  | "succeeded"
  | "failed"
  | "unknown";

export interface CreateQuoteRequest {
  channel: "consumer_global" | "consumer_cn" | "partner_api";
  countryCode: string;
  phoneNumber: string;
  operatorId?: string;
  productId: string;
  displayCurrency: string;
  promotionCodes?: string[];
}

export interface QuoteDto {
  id: string;
  productId: string;
  operatorId: string;
  recipientE164: string;
  faceValue: MoneyDto;
  salePrice: MoneyDto;
  serviceFee: MoneyDto;
  discount: MoneyDto;
  payableAmount: MoneyDto;
  expiresAt: string;
  pricingVersion: string;
}

export interface CreateTopupOrderRequest {
  quoteId: string;
  customerId?: string;
  contactEmail?: string;
  idempotencyKey: string;
  consentVersion: string;
}

export interface TopupOrderDto {
  id: string;
  publicNumber: string;
  status: TopupOrderStatus;
  customerId?: string;
  recipientE164Masked: string;
  countryCode: string;
  operatorId: string;
  productId: string;
  payableAmount: MoneyDto;
  createdAt: string;
  updatedAt: string;
}
