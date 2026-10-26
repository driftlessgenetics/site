<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { site } from '$lib/site';
  import ProductCard from '$lib/components/ProductCard.svelte';
  let { data } = $props();
</script>

<Seo path="/" />

<!-- Full-bleed photo hero, text anchored bottom-left -->
<section class="flex min-h-[80vh] items-end bg-cover bg-center p-6 md:p-10"
  style="background: linear-gradient(to top, #0008, #0000 50%), url({site.heroImage}) center/cover, var(--color-ice)">
  <div class="text-white">
    <h1 class="max-w-xl font-display text-4xl md:text-6xl">{site.tagline}</h1>
    <a href="#shop" class="btn mt-6 inline-block">Shop</a>
  </div>
</section>

<section id="shop" class="grid gap-3 bg-white p-3 md:grid-cols-3">
  {#each data.products as product (product.id)}<ProductCard {product} />{/each}
</section>
