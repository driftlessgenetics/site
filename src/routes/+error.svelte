<script lang="ts">
  import { page } from '$app/state';
</script>
<svelte:head><meta name="robots" content="noindex" /></svelte:head>
<div class="p-16 text-center"><h1 class="font-display text-4xl">{page.status}</h1><p class="mt-2">{page.error?.message}</p><a href="/" class="mt-6 inline-block underline">Home</a></div>
