export type LedgerSide = "debit" | "credit";

export interface JournalLine {
  accountId: string;
  side: LedgerSide;
  amountMinor: bigint;
  currency: string;
}

export interface JournalDraft {
  idempotencyKey: string;
  businessReference: string;
  occurredAt: string;
  lines: readonly JournalLine[];
}

export function validateJournal(draft: JournalDraft): void {
  if (draft.lines.length < 2)
    throw new Error("A journal requires at least two lines");

  const totals = new Map<string, { debit: bigint; credit: bigint }>();
  for (const line of draft.lines) {
    if (line.amountMinor <= 0n)
      throw new Error("Journal line amount must be positive");
    if (!/^[A-Z]{3}$/.test(line.currency))
      throw new Error(`Invalid currency: ${line.currency}`);
    const total = totals.get(line.currency) ?? { debit: 0n, credit: 0n };
    total[line.side] += line.amountMinor;
    totals.set(line.currency, total);
  }

  for (const [currency, total] of totals) {
    if (total.debit !== total.credit) {
      throw new Error(
        `Unbalanced journal for ${currency}: debit=${total.debit}, credit=${total.credit}`,
      );
    }
  }
}
