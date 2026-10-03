import type { DecimalMoney, IsoInstant } from "@wolinkup/shared-types";

export type HealthResponse = {
  readonly service: "tel-api";
  readonly status: "ok";
  readonly timestamp: IsoInstant;
};

export type QuoteResponse = {
  readonly expiresAt: IsoInstant;
  readonly id: string;
  readonly price: DecimalMoney;
  readonly recipientMasked: string;
};

export type OrderSummary = {
  readonly displayNumber: string;
  readonly id: string;
  readonly price: DecimalMoney;
  readonly status: string;
  readonly updatedAt: IsoInstant;
};
