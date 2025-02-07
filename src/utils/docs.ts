import { getCollection, render } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import type { DocsEntry, MenuItem } from '~/doc_types';
import { DOCS_BASE, DOCS_PERMALINK_PATTERN, trimSlash } from './permalinks';

let _docs: DocsEntry[];
let _books: MenuItem[];

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

export const fetchBooks = async (): Promise<MenuItem[]> => {
  if (!_books) {
    _books = await buildBooks();
  }

  return _books;
};

const buildBooks = async (): Promise<MenuItem[]> => {
  const books: MenuItem[] = [];
  const docs: DocsEntry[] = await fetchDocs();

  docs.forEach((entry: DocsEntry) => {
    let current = books;
    const parts = entry.id.split('/');
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
      current = item.children;
    }
  });

  return books;
};

const generatePermalink = (id: string): string => {
  const permalink = DOCS_PERMALINK_PATTERN.replace('%id%', id);
  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

export const getStaticPathsDocs = async () => {
  const docs = await fetchDocs();
  const headings: MarkdownHeading[][] = await Promise.all(
    docs.map((entry) => render(entry).then((data: { headings }) => data.headings))
  );

  const pages = docs.map((entry, index) => {
    return {
      params: { page: entry.id },
      props: { entry, headings: headings[index], page: entry.id },
    };
  });

  return pages;
};

export const fetchBook = async (slug: string): Promise<MenuItem[]> => {
  const books = await fetchBooks();
  return [books.find((book) => book.slug === slug)!];
};

export const previous = async (path: string): Promise<MenuItem | undefined> => {
  const [book] = path.replace(`/${DOCS_BASE}/`, '').split('/');
  const root = await fetchBook(book);

  const all_docs: MenuItem[] = [];
  const traverse = (items: MenuItem[]) => {
    items.forEach((item) => {
      if (item.children.length > 0) {
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

export const next = async (path: string): Promise<MenuItem | undefined> => {
  const [book] = path.replace(`/${DOCS_BASE}/`, '').split('/');
  const root = await fetchBook(book);

  const all_docs: MenuItem[] = [];
  const traverse = (items: MenuItem[]) => {
    items.forEach((item) => {
      if (item.children.length > 0) {
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
