<script lang="ts">
  import { page } from '$app/state';
</script>
<svelte:head><title>Order placed | Driftless Genetics</title><meta name="robots" content="noindex,nofollow" /></svelte:head>
<div class="mx-auto max-w-xl p-6 py-16 text-center">
  <h1 class="font-display text-4xl">Order #{page.url.searchParams.get('order')} placed</h1>
  <p class="mt-4">A receipt is on its way to your email.</p>
  <a href="/" class="btn mt-8 inline-block">Back to shop</a>
</div>
