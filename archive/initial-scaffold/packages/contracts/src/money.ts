export interface MoneyDto {
  /** Base-10 integer encoded as a string to preserve precision over JSON. */
  amountMinor: string;
  currency: string;
  exponent: number;
}

export interface FxRateDto {
  baseCurrency: string;
  quoteCurrency: string;
  numerator: string;
  denominator: string;
  source: string;
  observedAt: string;
  expiresAt: string;
}
