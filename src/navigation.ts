import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const getHeaderData = (m: typeof import('./paraglide/messages')) => ({
  links: [
    {
      text: m.nav_renoir(),
      links: [
        {
          text: m.nav_overview(),
          href: getPermalink('/renoir/overview'),
        },
        {
          text: m.nav_documentation(),
          href: getPermalink('/docs/renoir'),
        },
      ],
    },
    {
      text: m.nav_blog(),
      href: getBlogPermalink(),
    },
    {
      text: m.nav_roadmap(),
      href: getPermalink('/roadmap'),
    },
    {
      text: m.nav_contact(),
      href: getPermalink('/contact'),
    },
    {
      text: m.nav_about_us(),
      href: getPermalink('/about'),
    },
  ],
  actions: [{ text: m.nav_download(), href: 'https://github.com/deib-polimi/renoir', target: '_blank' }],
});

export const getFooterData = (m: typeof import('./paraglide/messages')) => ({ 
  links: [
    {
      title: m.nav_renoir(),
      links: [
        { text: m.nav_overview(), href: getPermalink('/renoir/overview') },
        { text: m.nav_documentation(), href: getPermalink('/docs/renoir') },
        { text: m.footer_reference(), href: 'https://github.com/deib-polimi/renoir' },
      ],
    },
    {
      title: m.footer_community(),
      links: [
        { text: m.nav_blog(), href: getBlogPermalink() },
        { text: m.nav_roadmap(), href: getPermalink('/roadmap') },
        { text: m.nav_contact(), href: getPermalink('/contact') },
      ],
    },
    {
      title: m.footer_databrush(),
      links: [
        { text: m.footer_about(), href: getPermalink('/about') },
        { text: m.nav_contact(), href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: m.footer_cookie_policy(), href: getPermalink('/terms') },
    { text: m.footer_privacy_policy(), href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/data-brush' },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/deib-polimi/renoir' },
  ],
});
