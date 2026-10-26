<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  let { data } = $props();
</script>

<Seo title="Blog" description="Guides on growing and using lion’s mane, reishi, and chaga mushrooms." path="/blog" />
<ul class="mx-auto max-w-2xl divide-y divide-ink/10 p-6 py-12">
  {#each data.posts as p (p.slug)}
    <li class="py-6">
      <a href="/blog/{p.slug}" class="font-display text-2xl hover:underline">{p.title}</a>
      <p class="mt-2">{p.summary}</p>
    </li>
  {/each}
</ul>
