export const Cultures = {
  Russian: 'ru',
  English: 'en',
} as const;

export type SupportedCulture = (typeof Cultures)[keyof typeof Cultures];

export const supportedCultures = [Cultures.Russian, Cultures.English] as const;

export const defaultCulture: SupportedCulture = Cultures.English;

export function isSupportedCulture(value: string): value is SupportedCulture {
  return supportedCultures.includes(value as SupportedCulture);
}

export function getCultureLabel(culture: SupportedCulture): string {
  switch (culture) {
    case Cultures.Russian:
      return 'Русский';
    case Cultures.English:
      return 'English';
    default:
      return culture;
  }
}
