<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { site } from '$lib/site';
  import { crumbs, clip } from '$lib/seo';
  import { money } from '$lib/format';
  import { store } from '$lib/store.svelte';
  let { data } = $props();
  const p = $derived(data.product);
  let variantId = $state(''), added = $state(false);
  $effect(() => { variantId ||= p.variants?.[0]?.id ?? ''; });
  const variant = $derived(p.variants?.find((v) => v.id === variantId));
  const ld = $derived([
    { '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: clip(p.description ?? ''), image: p.thumbnail ? [p.thumbnail] : undefined,
      brand: { '@type': 'Brand', name: site.name },
      offers: (p.variants ?? []).map((v) => ({ '@type': 'Offer', name: v.title, url: `${site.url}/products/${p.handle}`,
        price: v.calculated_price?.calculated_amount, priceCurrency: (v.calculated_price?.currency_code ?? 'usd').toUpperCase(), availability: 'https://schema.org/InStock' })) },
    crumbs([['Home', '/'], [p.title, `/products/${p.handle}`]])
  ]);
  async function add() { await store.add(variantId); added = true; setTimeout(() => (added = false), 1500); }
</script>

<Seo title={p.title} description={clip(p.description ?? '') || undefined} path="/products/{p.handle}" image={p.thumbnail ?? undefined} jsonLd={ld} />
<div class="grid gap-3 p-3 md:grid-cols-2">
  <div class="flex aspect-square items-center justify-center bg-paper p-8">
    {#if p.thumbnail}<img src={p.thumbnail} alt={p.title} fetchpriority="high" class="max-h-full object-contain" />{/if}
  </div>
  <div class="flex flex-col justify-center gap-5 p-6 md:p-16">
    <h1 class="font-display text-4xl">{p.title}</h1>
    <p class="max-w-prose">{p.description}</p>
    <div class="flex gap-2">
      {#each p.variants ?? [] as v}
        <button onclick={() => (variantId = v.id)} aria-pressed={v.id === variantId}
          class="border border-ink px-4 py-2 aria-pressed:bg-ink aria-pressed:text-ice">{v.title}</button>
      {/each}
    </div>
    <p class="text-xl">{money(variant?.calculated_price?.calculated_amount ?? 0)}</p>
    <button class="btn w-fit" onclick={add}>{added ? 'Added' : 'Add to cart'}</button>
  </div>
</div>
