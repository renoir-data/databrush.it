// Make similar changes to config.ts in content folder
export type DocsData = {
  title: string;
  order: number;
};

// Define the type for docs collection
export type DocsEntry = CollectionEntry<'docs'> & {
  data: DocsData;
  id: string;
};

// For [...slug].astro
export interface Heading {
  text: string;
  depth: number;
  slug: string;
}

// Define the props for the SideNavMenu component
export type SideNavMenuProps = {
  items: MenuItem[];
  level: number;
};

export type MenuItem = {
  title: string;
  slug: string;
  permalink: string;
  order: number;
  level: number;
  children: MenuItem[];
};

// Define heading hierarchy so that we can generate ToC
export interface HeadingHierarchy extends MarkdownHeading {
  subheadings: HeadingHierarchy[];
  depth: number;
  text: string;
  slug: string;
}

// For TableofContents.astro
export interface HeadingProps {
  headings: HeadingHierarchy[]
}