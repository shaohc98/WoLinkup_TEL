import type { MoneyDto } from "@wolinkup/contracts";

export interface SupplierTopupRequest {
  attemptId: string;
  idempotencyKey: string;
  supplierSkuId: string;
  recipientE164: string;
  faceValue: MoneyDto;
}

export interface SupplierTopupResult {
  supplierOrderId?: string;
  status: "accepted" | "processing" | "succeeded" | "failed" | "unknown";
  supplierCode: string;
  supplierMessage?: string;
  rawResponseReference: string;
}

export interface SupplierQueryRequest {
  attemptId: string;
  supplierOrderId: string;
}

export interface SupplierAdapter {
  readonly supplierCode: string;
  submitTopup(request: SupplierTopupRequest): Promise<SupplierTopupResult>;
  queryTopup(request: SupplierQueryRequest): Promise<SupplierTopupResult>;
  queryBalance(): Promise<MoneyDto[]>;
  verifyCallback(
    headers: Readonly<Record<string, string>>,
    rawBody: Uint8Array,
  ): Promise<boolean>;
  parseCallback(rawBody: Uint8Array): Promise<SupplierTopupResult>;
}
