<script lang="ts">
  import { site } from '$lib/site';
  import { store } from '$lib/store.svelte';
</script>

<header class="flex items-center justify-between bg-ink px-6 py-3 text-ice">
  <a href="/"><img src="/wordmark.png" alt={site.name} width="162" height="48" class="h-12 w-auto" /></a>
  <nav class="flex items-center gap-5 md:gap-8">
    {#each site.nav as l}<a href={l.href} class="hover:underline">{l.label}</a>{/each}
    <a href={store.customer ? '/account' : '/signin'} class="hover:underline">{store.customer ? 'Account' : 'Sign in'}</a>
    <a href="/cart" class="border border-ice px-2 text-sm" aria-label="Cart, {store.count} items">{store.count}</a>
  </nav>
</header>
