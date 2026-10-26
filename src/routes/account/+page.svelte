<script lang="ts">
  import type { HttpTypes } from '@medusajs/types';
  import { sdk } from '$lib/medusa';
  import { money } from '$lib/format';
  import { store } from '$lib/store.svelte';
  let orders = $state<HttpTypes.StoreOrder[]>([]);
  $effect(() => { if (store.customer) sdk.store.order.list({ order: '-created_at' }).then((r) => (orders = r.orders)); });
</script>

<svelte:head><title>Account | Driftless Genetics</title><meta name="robots" content="noindex,nofollow" /></svelte:head>
<div class="mx-auto max-w-2xl p-6 py-12">
  {#if !store.customer}
    <button class="btn" onclick={() => store.signIn()}>Sign in with Google</button>
  {:else}
    <h1 class="font-display text-3xl">{store.customer.email}</h1>
    <h2 class="mt-10 text-xl">Orders</h2>
    {#each orders as o (o.id)}
      <p class="flex justify-between border-b border-ink/10 py-3">
        <span>#{o.display_id} · {new Date(o.created_at).toLocaleDateString()}</span>
        <span>{o.fulfillment_status.replace('_', ' ')} · {money(o.total)}</span>
      </p>
    {:else}<p class="mt-3">No orders yet.</p>{/each}
    <button class="mt-8 underline" onclick={() => store.signOut()}>Sign out</button>
  {/if}
</div>
