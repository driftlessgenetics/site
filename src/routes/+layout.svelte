<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import Nav from '$lib/components/Nav.svelte';
  import NewsletterPopup from '$lib/components/NewsletterPopup.svelte';
  import { store } from '$lib/store.svelte';
  import { site } from '$lib/site';
  import { siteLd, ldScript } from '$lib/seo';
  let { children } = $props();
  onMount(() => store.init());
</script>

<svelte:head>{@html ldScript(siteLd)}</svelte:head>
<Nav />
<main>{@render children()}</main>
<footer class="bg-ink px-6 py-8 text-ice">
  <nav class="flex flex-wrap gap-6 text-sm">
    {#each site.legal as l}<a href={l.href} class="hover:underline">{l.label}</a>{/each}
    <a href="mailto:{site.email}" class="hover:underline">{site.email}</a>
  </nav>
</footer>
<NewsletterPopup />
