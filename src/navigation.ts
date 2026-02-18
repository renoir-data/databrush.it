import { getRelativeLocaleUrl } from 'astro:i18n';

export const getHeaderData = (m: typeof import('./paraglide/messages'), lang: string) => ({
  homeLink: getRelativeLocaleUrl(lang, '/'),
  links: [
    {
      text: m.nav_renoir(),
      links: [
        {
          text: m.nav_overview(),
          href: getRelativeLocaleUrl(lang, '/renoir/overview'),
        },
        {
          text: m.nav_documentation(),
          href: getRelativeLocaleUrl(lang, '/docs/renoir'),
        },
      ],
    },
    {
      text: 'Agent²',
      href: getRelativeLocaleUrl(lang, '/agent2'),
      className: 'text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300',
    },
    {
      text: m.nav_blog(),
      href: getRelativeLocaleUrl(lang, '/blog'),
    },
    {
      text: m.nav_contact(),
      href: getRelativeLocaleUrl(lang, '/contact'),
    },
    {
      text: m.nav_about_us(),
      href: getRelativeLocaleUrl(lang, '/about'),
    },
  ],
});

export const getFooterData = (m: typeof import('./paraglide/messages'), lang: string) => ({ 
  links: [
    {
      title: m.nav_renoir(),
      links: [
        { text: m.nav_overview(), href: getRelativeLocaleUrl(lang, '/renoir/overview') },
        { text: m.nav_documentation(), href: getRelativeLocaleUrl(lang, '/docs/renoir') },
        { text: m.footer_reference(), href: getRelativeLocaleUrl(lang, 'https://github.com/deib-polimi/renoir') },
      ],
    },
    {
      title: m.footer_community(),
      links: [
        { text: 'Agent²', href: getRelativeLocaleUrl(lang, '/agent2') },
        { text: m.nav_blog(), href: getRelativeLocaleUrl(lang, '/blog') },
        { text: m.nav_roadmap(), href: getRelativeLocaleUrl(lang, '/roadmap') },
        { text: m.nav_contact(), href: getRelativeLocaleUrl(lang, '/contact') },
      ],
    },
    {
      title: m.footer_databrush(),
      links: [
        { text: m.footer_about(), href: getRelativeLocaleUrl(lang, '/about') },
        { text: m.nav_contact(), href: getRelativeLocaleUrl(lang, '/contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: m.footer_cookie_policy(), href: getRelativeLocaleUrl(lang, '/terms') },
    { text: m.footer_privacy_policy(), href: getRelativeLocaleUrl(lang, '/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/data-brush' },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/deib-polimi/renoir' },
  ],
});
