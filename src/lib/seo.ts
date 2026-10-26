import { site } from './site';

export const orgLd = {
  '@type': 'Organization', name: site.name, url: site.url, email: site.email,
  logo: { '@type': 'ImageObject', url: `${site.url}/ginkgo.png` },
  address: { '@type': 'PostalAddress', addressLocality: 'Minneapolis', addressRegion: 'MN', addressCountry: 'US' }
};
export const siteLd = [
  { '@context': 'https://schema.org', ...orgLd },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url }
];
export const crumbs = (items: [string, string][]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.url + path }))
});
export const clip = (s = '', n = 155) => s.replace(/\s+/g, ' ').trim().slice(0, n);
export const ldScript = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
