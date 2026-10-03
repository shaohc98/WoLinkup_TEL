import assert from "node:assert/strict";
import test from "node:test";

import { validateJournal } from "./validate-journal.js";

test("accepts a balanced journal", () => {
  assert.doesNotThrow(() =>
    validateJournal({
      idempotencyKey: "payment:pay_1:capture",
      businessReference: "pay_1",
      occurredAt: "2026-09-25T00:00:00.000Z",
      lines: [
        {
          accountId: "cash",
          side: "debit",
          amountMinor: 10_000n,
          currency: "CNY",
        },
        {
          accountId: "customer-funds",
          side: "credit",
          amountMinor: 10_000n,
          currency: "CNY",
        },
      ],
    }),
  );
});

test("rejects an unbalanced journal", () => {
  assert.throws(
    () =>
      validateJournal({
        idempotencyKey: "bad",
        businessReference: "bad",
        occurredAt: "2026-09-25T00:00:00.000Z",
        lines: [
          {
            accountId: "cash",
            side: "debit",
            amountMinor: 100n,
            currency: "USD",
          },
          {
            accountId: "revenue",
            side: "credit",
            amountMinor: 99n,
            currency: "USD",
          },
        ],
      }),
    /Unbalanced journal/,
  );
});
