export type SupplierCapabilities = {
  readonly callback: boolean;
  readonly idempotentSubmission: boolean;
  readonly originalRequestQuery: boolean;
};

export type SubmitTopupRequest = {
  readonly amount: string;
  readonly currency: string;
  readonly idempotencyKey: string;
  readonly recipientE164: string;
  readonly supplierProductId: string;
};

export type QueryTopupRequest = {
  readonly idempotencyKey: string;
  readonly supplierRequestId?: string;
};

export type SupplierTopupResult = {
  readonly rawStatus: string;
  readonly status:
    | "SUBMITTED"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED_FINAL"
    | "RESULT_UNKNOWN";
  readonly supplierRequestId?: string;
};

export interface SupplierAdapter {
  readonly capabilities: SupplierCapabilities;
  readonly supplierId: string;
  query(request: QueryTopupRequest): Promise<SupplierTopupResult>;
  submit(request: SubmitTopupRequest): Promise<SupplierTopupResult>;
}
