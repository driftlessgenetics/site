<script lang="ts">
  import { site } from '$lib/site';
  import { ldScript } from '$lib/seo';
  let { title, description = site.description, path, image = site.ogImage, type = 'website', published, noindex = false, jsonLd = [] }:
    { title?: string; description?: string; path: string; image?: string; type?: 'website' | 'article'; published?: string; noindex?: boolean; jsonLd?: unknown[] } = $props();
  const full = $derived(title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`);
  const url = $derived(site.url + (path === '/' ? '' : path));
  const img = $derived(image.startsWith('http') ? image : site.url + image);
</script>

<svelte:head>
  <title>{full}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={full} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={img} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={full} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={img} />
  {#if published}<meta property="article:published_time" content={published} />{/if}
  {#if jsonLd.length}{@html ldScript(jsonLd)}{/if}
</svelte:head>
