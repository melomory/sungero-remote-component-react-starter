export const normalizeLanguage = (lang?: string): 'ru' | 'en' => {
  if (!lang) return 'ru';
  return lang.startsWith('en') ? 'en' : 'ru';
};
