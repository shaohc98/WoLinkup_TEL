export const supportedLocales = ["en", "zh-CN"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export type MessageCatalog<TMessageKey extends string = string> = Readonly<
  Record<TMessageKey, string>
>;

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.some((locale) => locale === value);
}
