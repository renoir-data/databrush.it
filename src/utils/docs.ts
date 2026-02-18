import { getCollection, render } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import type { DocsEntry, MenuItem } from '~/doc_types';
import { DOCS_BASE } from './permalinks';

let _docs: DocsEntry[];


const load = async function (): Promise<DocsEntry[]> {
  const docs = await getCollection('docs');
  return Promise.all(docs);
};


export const fetchDocs = async (): Promise<DocsEntry[]> => {
  if (!_docs) {
    _docs = await load();
  }

  return _docs;
};

const buildBooks = async (locale: string = 'en'): Promise<MenuItem[]> => {
  const books: MenuItem[] = [];
  const docs: DocsEntry[] = await fetchDocs();

  // Filter docs by locale using string pattern
  const localePrefix = `${locale}/`;
  const filteredDocs = docs.filter(doc => doc.id.startsWith(localePrefix));

  filteredDocs.forEach((entry: DocsEntry) => {
    let current = books;
    // Remove locale prefix from entry.id (e.g., 'en/getting-started/intro' -> 'getting-started/intro')
    const pathWithoutLocale = entry.id.slice(localePrefix.length);
    const parts = pathWithoutLocale.split('/');
    
    for (let i = 0; i < parts.length; i++) {
      let item: MenuItem | undefined = current.find((item) => item.slug === parts[i]);
      if (!item) {
        item = {
          title: '',
          slug: parts[i],
          permalink: '',
          order: 0,
          level: i,
          children: [],
        };
        current.push(item!);
      }
      if (i + 1 == parts.length) {
        item.title = entry.data.title;
        item.order = entry.data.order;
        item.permalink = generatePermalink(entry.id);
      }
      current.sort((a, b) => a.order - b.order);
      current = item.children || [];
    }
  });

  return books;
};

export const fetchBooks = async (locale: string = 'en'): Promise<MenuItem[]> => {
  // Don't cache when using locale to ensure fresh data
  return await buildBooks(locale);
};

const generatePermalink = (id: string): string => {
  // id format: locale/book/page (e.g., 'en/getting-started/intro')
  // Generate: locale/docs/book/page (e.g., 'en/docs/getting-started/intro')
  const parts = id.split('/');
  const locale = parts[0];
  const pathWithoutLocale = parts.slice(1).join('/');
  
  return `${locale}/${DOCS_BASE}/${pathWithoutLocale}`;
};

export const getStaticPathsDocs = async () => {
  const docs = await fetchDocs();
  const headings: MarkdownHeading[][] = await Promise.all(
    docs.map((entry) => render(entry).then((data: { headings }) => data.headings))
  );

  const pages = docs.map((entry, index) => {
    const lang = entry.id.split('/')[0];
    const page = entry.id.split('/').slice(1).join('/');
    return {
      params: { lang, page },
      props: { entry, headings: headings[index], page: entry.id },
    };
  });

  return pages;
};

export const fetchBook = async (slug: string, locale: string = 'en'): Promise<MenuItem[]> => {
  const books = await fetchBooks(locale);
  const book = books.find((book) => book.slug === slug);
  return book ? [book] : [];
};

export const previous = async (path: string, locale: string = 'en'): Promise<MenuItem | undefined> => {
  // path format: /{locale}/docs/{book}/{...pages} (e.g., /en/docs/getting-started/intro)
  const localeDocsPrefix = `/${locale}/${DOCS_BASE}/`;
  
  if (!path.startsWith(localeDocsPrefix)) {
    return undefined;
  }
  
  // Extract book from path (first segment after /locale/docs/)
  const pathAfterDocs = path.slice(localeDocsPrefix.length);
  const [book] = pathAfterDocs.split('/');
  
  const root = await fetchBook(book, locale);

  if (!root || root.length === 0) {
    return undefined;
  }

  const all_docs: MenuItem[] = [];
  const traverse = (items: MenuItem[]) => {
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      } else {
        all_docs.push(item);
      }
    });
  };

  traverse(root);

  const currentIndex = all_docs.findIndex((doc) => `/${doc.permalink}` === path);
  if (currentIndex > 0) {
    return all_docs[currentIndex - 1];
  }

  return undefined;
};

export const next = async (path: string, locale: string = 'en'): Promise<MenuItem | undefined> => {
  // path format: /{locale}/docs/{book}/{...pages} (e.g., /en/docs/getting-started/intro)
  const localeDocsPrefix = `/${locale}/${DOCS_BASE}/`;
  
  if (!path.startsWith(localeDocsPrefix)) {
    return undefined;
  }
  
  // Extract book from path (first segment after /locale/docs/)
  const pathAfterDocs = path.slice(localeDocsPrefix.length);
  const [book] = pathAfterDocs.split('/');
  
  const root = await fetchBook(book, locale);

  if (!root || root.length === 0) {
    return undefined;
  }

  const all_docs: MenuItem[] = [];
  const traverse = (items: MenuItem[]) => {
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      } else {
        all_docs.push(item);
      }
    });
  };

  traverse(root);

  const currentIndex = all_docs.findIndex((doc) => `/${doc.permalink}` === path);
  if (currentIndex !== -1 && currentIndex < all_docs.length - 1) {
    return all_docs[currentIndex + 1];
  }

  return undefined;
};
