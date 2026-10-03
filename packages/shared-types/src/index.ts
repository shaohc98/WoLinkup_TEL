declare const brand: unique symbol;

export type Brand<TValue, TName extends string> = TValue & {
  readonly [brand]: TName;
};

export type CorrelationId = Brand<string, "CorrelationId">;
export type IdempotencyKey = Brand<string, "IdempotencyKey">;
export type IsoInstant = Brand<string, "IsoInstant">;

export type DecimalMoney = {
  readonly amount: string;
  readonly currency: string;
};

export type ProblemDetails = {
  readonly code: string;
  readonly correlationId: string;
  readonly detail?: string;
  readonly status: number;
  readonly title: string;
  readonly type: string;
};
