<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import Seo from './Seo.svelte';
  import { site } from '$lib/site';
  import { crumbs, orgLd } from '$lib/seo';
  let { title, description, date, image, children }: { title?: string; description?: string; date?: string; image?: string; children: Snippet } = $props();
  const path = $derived(page.url.pathname);
  const img = $derived(image ?? site.ogImage);
  const ld = $derived(date ? [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title, description, datePublished: date, dateModified: date,
      image: img.startsWith('http') ? img : site.url + img, mainEntityOfPage: site.url + path,
      author: orgLd, publisher: orgLd },
    crumbs([['Home', '/'], ['Blog', '/blog'], [title ?? '', path]])
  ] : []);
</script>

<Seo {title} {description} {path} image={img} type={date ? 'article' : 'website'} published={date} jsonLd={ld} />
<article class="prose prose-lg mx-auto max-w-2xl p-6 py-12 prose-headings:font-display prose-headings:font-normal prose-a:text-ink">
  {#if title}<h1>{title}</h1>{/if}
  {#if date}<p class="text-ink/60"><time datetime={date}>{new Date(date).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' })}</time></p>{/if}
  {@render children()}
</article>
