import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type LocalizedContent<T extends 'post' | 'docs'> = {
  locale: string;
  content: CollectionEntry<T>;
};

/**
 * Extract locale from content path
 * Examples:
 * - 'it/future-24' -> 'it'
 * - 'it/renoir/index' -> 'it'
 * - 'future-24' -> 'en' (default)
 * - 'renoir/index' -> 'en' (default)
 */
export function extractLocaleFromPath(path: string): { locale: string; cleanPath: string } {
  const parts = path.split('/');
  const supportedLocales = ['en', 'it'];
  
  if (supportedLocales.includes(parts[0])) {
    return {
      locale: parts[0],
      cleanPath: parts.slice(1).join('/')
    };
  }
  
  return {
    locale: 'en', // default locale
    cleanPath: path
  };
}

/**
 * Get content filtered by locale
 */
export async function getLocalizedContent<T extends 'post' | 'docs'>(
  collection: T,
  locale: string = 'en'
): Promise<LocalizedContent<T>[]> {
  const allContent = await getCollection(collection);
  
  return allContent
    .map((content) => {
      const { locale: contentLocale, cleanPath } = extractLocaleFromPath(content.id);
      return {
        locale: contentLocale,
        content: {
          ...content,
          id: cleanPath, // Use clean path for consistency
          _originalId: content.id // Keep original for reference
        } as CollectionEntry<T>
      };
    })
    .filter((item) => item.locale === locale);
}

/**
 * Get content in all locales, grouped by clean path
 */
export async function getAllLocalizedContent<T extends 'post' | 'docs'>(
  collection: T
): Promise<Record<string, LocalizedContent<T>[]>> {
  const allContent = await getCollection(collection);
  const grouped: Record<string, LocalizedContent<T>[]> = {};
  
  allContent.forEach((content) => {
    const { locale, cleanPath } = extractLocaleFromPath(content.id);
    
    if (!grouped[cleanPath]) {
      grouped[cleanPath] = [];
    }
    
    grouped[cleanPath].push({
      locale,
      content: {
        ...content,
        id: cleanPath,
        _originalId: content.id
      } as CollectionEntry<T>
    });
  });
  
  return grouped;
}

/**
 * Get localized content entry by path and locale
 */
export async function getLocalizedEntry<T extends 'post' | 'docs'>(
  collection: T,
  path: string,
  locale: string = 'en'
): Promise<CollectionEntry<T> | undefined> {
  const localizedContent = await getLocalizedContent(collection, locale);
  const entry = localizedContent.find((item) => item.content.id === path);
  return entry?.content;
}

/**
 * Get available locales for a specific content path
 */
export async function getAvailableLocales<T extends 'post' | 'docs'>(
  collection: T,
  path: string
): Promise<string[]> {
  const allGrouped = await getAllLocalizedContent(collection);
  const contentGroup = allGrouped[path];
  
  if (!contentGroup) return [];
  
  return contentGroup.map(item => item.locale);
}