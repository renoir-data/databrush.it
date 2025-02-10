import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Renoir',
      links: [
        {
          text: 'Overview',
          href: getPermalink('/renoir/overview'),
        },
        {
          text: 'Documentation',
          href: getPermalink('/docs/renoir'),
        },
      ],
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Roadmap',
      href: getPermalink('/roadmap'),
    },
    {
      text: 'Contact',
      href: '/contact',
    },
    {
      text: 'About Us',
      href: '/about',
    },
  ],
  actions: [{ text: 'Download', href: 'https://github.com/deib-polimi/renoir', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Renoir',
      links: [
        { text: 'Overview', href: '/renoir/overview' },
        { text: 'Documentation', href: '/docs/renoir' },
        { text: 'Reference', href: 'https://github.com/deib-polimi/renoir' },
      ],
    },
    {
      title: 'Community',
      links: [
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Roadmap', href: '/roadmap' },
        { text: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Databrush',
      links: [
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/data-brush' },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/deib-polimi/renoir' },
  ],
};
