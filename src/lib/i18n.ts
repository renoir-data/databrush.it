export const LANGUAGES = ['en', 'it'];

export function getLanguagePaths() {
  return LANGUAGES.map((lang) => ({
    params: { lang }
  }));
}