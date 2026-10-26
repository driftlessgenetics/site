<script lang="ts">
  import { money } from '$lib/format';
  import { store } from '$lib/store.svelte';
</script>

<svelte:head><title>Cart | Driftless Genetics</title><meta name="robots" content="noindex,nofollow" /></svelte:head>
<div class="mx-auto max-w-2xl p-6">
  {#if !store.cart?.items?.length}
    <p>Your cart is empty. <a href="/#shop" class="underline">Shop</a></p>
  {:else}
    <ul class="divide-y divide-ink/10">
      {#each store.cart.items as i (i.id)}
        <li class="flex items-center justify-between py-4">
          <span>{i.product_title} <span class="text-ink/60">{i.variant_title}</span></span>
          <span class="flex items-center gap-4">
            <button onclick={() => store.setQty(i.id, i.quantity - 1)} aria-label="Remove one">−</button>
            {i.quantity}
            <button onclick={() => store.setQty(i.id, i.quantity + 1)} aria-label="Add one">+</button>
            {money(i.total)}
          </span>
        </li>
      {/each}
    </ul>
    <div class="mt-6 flex items-center justify-between"><p class="text-xl">{money(store.cart.subtotal)}</p><a href="/checkout" class="btn">Checkout</a></div>
  {/if}
</div>
