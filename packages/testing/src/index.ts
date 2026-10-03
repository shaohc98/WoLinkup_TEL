export type Clock = {
  now(): Date;
};

export function createFixedClock(instant: string): Clock {
  const fixed = new Date(instant);
  if (Number.isNaN(fixed.getTime())) {
    throw new Error(`Invalid fixed clock instant: ${instant}`);
  }

  return {
    now: () => new Date(fixed),
  };
}

export function createSequence(prefix: string): () => string {
  let value = 0;
  return () => `${prefix}-${String(++value).padStart(4, "0")}`;
}
