import { z } from "zod";

export const currencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "Expected an ISO 4217 currency code");

export const decimalAmountSchema = z
  .string()
  .regex(/^(0|[1-9]\d*)(\.\d+)?$/, "Expected a non-negative decimal amount");

export const e164Schema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Expected an E.164 phone number");

export const idempotencyKeySchema = z.string().min(8).max(128);

export const moneySchema = z.object({
  amount: decimalAmountSchema,
  currency: currencyCodeSchema,
});
