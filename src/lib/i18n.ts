import * as m from '../paraglide/messages.js';
import { setLocale } from '../paraglide/runtime.js';

export const LANGUAGES = ['en', 'it'];

export function loadLocale(lang: string) {
  if (LANGUAGES.includes(lang)) {
    setLocale(lang as "en" | "it");
    return m;
  }
  throw new Error(`Unsupported language: ${lang}`);
}
export function getLanguagePaths() {
  return LANGUAGES.map((lang) => ({
    params: { lang }
  }));
}