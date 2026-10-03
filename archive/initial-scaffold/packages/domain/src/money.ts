import type { MoneyDto } from "@wolinkup/contracts";

export class Money {
  private constructor(
    readonly amountMinor: bigint,
    readonly currency: string,
    readonly exponent: number,
  ) {
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error(`Invalid currency code: ${currency}`);
    }
    if (!Number.isInteger(exponent) || exponent < 0 || exponent > 3) {
      throw new Error(`Unsupported currency exponent: ${exponent}`);
    }
  }

  static fromMinor(amountMinor: bigint, currency: string, exponent = 2): Money {
    return new Money(amountMinor, currency, exponent);
  }

  static fromDecimal(value: string, currency: string, exponent = 2): Money {
    const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value);
    if (!match) throw new Error(`Invalid decimal amount: ${value}`);

    const fraction = match[3] ?? "";
    if (fraction.length > exponent) {
      throw new Error(
        `Amount ${value} has more than ${exponent} decimal places`,
      );
    }

    const scale = 10n ** BigInt(exponent);
    const whole = BigInt(match[2] ?? "0") * scale;
    const minorFraction = BigInt(fraction.padEnd(exponent, "0") || "0");
    const sign = match[1] === "-" ? -1n : 1n;
    return new Money(sign * (whole + minorFraction), currency, exponent);
  }

  add(other: Money): Money {
    this.assertCompatible(other);
    return new Money(
      this.amountMinor + other.amountMinor,
      this.currency,
      this.exponent,
    );
  }

  subtract(other: Money): Money {
    this.assertCompatible(other);
    return new Money(
      this.amountMinor - other.amountMinor,
      this.currency,
      this.exponent,
    );
  }

  multiplyBasisPoints(basisPoints: number): Money {
    if (!Number.isInteger(basisPoints))
      throw new Error("Basis points must be an integer");
    const numerator = this.amountMinor * BigInt(basisPoints);
    const rounded =
      numerator >= 0n
        ? (numerator + 5_000n) / 10_000n
        : (numerator - 5_000n) / 10_000n;
    return new Money(rounded, this.currency, this.exponent);
  }

  toDto(): MoneyDto {
    return {
      amountMinor: this.amountMinor.toString(),
      currency: this.currency,
      exponent: this.exponent,
    };
  }

  private assertCompatible(other: Money): void {
    if (this.currency !== other.currency || this.exponent !== other.exponent) {
      throw new Error(
        "Cannot calculate with different currencies or exponents",
      );
    }
  }
}
