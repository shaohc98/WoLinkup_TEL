export interface DomainEvent<TType extends string, TPayload> {
  eventId: string;
  eventType: TType;
  eventVersion: number;
  aggregateType: string;
  aggregateId: string;
  occurredAt: string;
  correlationId: string;
  causationId?: string;
  payload: TPayload;
}

export interface TopupOrderStatusChangedPayload {
  previousStatus: string;
  currentStatus: string;
  reasonCode: string;
  actorType: "customer" | "operator" | "system" | "supplier";
}

export type TopupOrderStatusChanged = DomainEvent<
  "topup.order_status_changed",
  TopupOrderStatusChangedPayload
>;
