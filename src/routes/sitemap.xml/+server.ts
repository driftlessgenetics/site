import { site } from '$lib/site';
import { posts } from '$lib/posts';
import { listProducts } from '$lib/medusa';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const url = (loc: string, lastmod?: string, image?: string | null) =>
  `<url><loc>${site.url}${loc}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}` +
  `${image ? `<image:image><image:loc>${esc(image)}</image:loc></image:image>` : ''}</url>`;

// Rendered on request (not at build) so new products appear without a redeploy.
export const GET = async () => {
  const products = await listProducts().catch(() => []);
  const urls = [
    url('/'), url('/blog', posts[0]?.date),
    ...posts.map((p) => url(`/blog/${p.slug}`, p.date)),
    ...site.legal.map((l) => url(l.href)),
    ...products.map((p) => url(`/products/${p.handle}`, String(p.updated_at ?? ''), p.thumbnail))
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
};
