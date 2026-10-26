import { site } from '$lib/site';
export const prerender = true;
export const GET = () => new Response(
  `User-agent: *\nDisallow: /cart\nDisallow: /checkout\nDisallow: /account\nDisallow: /order\nDisallow: /signin\nDisallow: /auth/\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`,
  { headers: { 'Content-Type': 'text/plain' } });
