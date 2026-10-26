<script lang="ts">
  import type { HttpTypes } from '@medusajs/types';
  import { money } from '$lib/format';
  let { product }: { product: HttpTypes.StoreProduct } = $props();
  const price = $derived(Math.min(...(product.variants ?? []).map((v) => v.calculated_price?.calculated_amount ?? Infinity)));
</script>

<a href="/products/{product.handle}" class="group flex aspect-[4/5] flex-col bg-paper p-5">
  <div class="flex flex-1 items-center justify-center">
    {#if product.thumbnail}<img src={product.thumbnail} alt={product.title} loading="lazy" decoding="async" class="max-h-full object-contain" />{/if}
  </div>
  <div class="flex items-end justify-between">
    <div>
      <p>{product.title}</p>
      <p class="text-sm">From {money(price)}</p>
      <p class="text-sm text-ink/60">{product.variants?.map((v) => v.title).join(' | ')}</p>
    </div>
    <span class="group-hover:underline">Explore</span>
  </div>
</a>
