import { z } from "zod";

export type EventEnvelope<TType extends string, TPayload> = {
  readonly correlationId: string;
  readonly id: string;
  readonly occurredAt: string;
  readonly payload: TPayload;
  readonly producer: string;
  readonly type: TType;
  readonly version: number;
};

export const eventMetadataSchema = z.object({
  correlationId: z.string().min(1),
  id: z.uuid(),
  occurredAt: z.iso.datetime(),
  producer: z.string().min(1),
  type: z.string().min(1),
  version: z.int().positive(),
});
