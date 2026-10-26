import { site } from '$lib/site';
import { posts } from '$lib/posts';
export const prerender = true;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export const GET = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)}</title><link>${site.url}/blog</link><description>${esc(site.description)}</description>` +
  posts.map((p) => `<item><title>${esc(p.title)}</title><link>${site.url}/blog/${p.slug}</link><guid>${site.url}/blog/${p.slug}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`).join('') +
  `</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml' } });
