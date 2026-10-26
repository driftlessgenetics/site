<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { site } from '$lib/site';
  import { store } from '$lib/store.svelte';
  let open = $state(false), email = $state(''), msg = $state(''), done = $state(false), busy = $state(false);
  const hidden = $derived(/^\/(cart|checkout|account|signin|order|auth)/.test(page.url.pathname) || !!store.customer);

  // Remembered per browser: dismissed offers return after 30 days, subscribers never see it again.
  const snooze = (days: number) => localStorage.setItem('offer_until', String(Date.now() + days * 864e5));
  onMount(() => {
    if (Number(localStorage.getItem('offer_until')) > Date.now()) return;
    const t = setTimeout(() => (open = true), site.popupDelayMs);
    return () => clearTimeout(t);
  });
  const close = () => { open = false; snooze(30); };
  async function submit(e: SubmitEvent) {
    e.preventDefault(); busy = true;
    const r = await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    done = r.ok; msg = r.ok ? 'Your code is on its way. Check your inbox.' : 'Could not send the code. Check the address and try again.';
    if (r.ok) snooze(3650);
    busy = false;
  }
</script>

{#if open && !hidden}
  <aside aria-label="Email list" class="fixed right-4 bottom-4 z-50 w-72 bg-ink p-4 text-ice shadow-xl">
    <button onclick={close} aria-label="Close" class="absolute top-2 right-3">×</button>
    <p class="font-display text-xl">{site.discount} off your first order</p>
    {#if done}
      <p role="status" class="mt-3 text-sm">{msg}</p>
    {:else}
      <form onsubmit={submit} class="mt-3 flex gap-2">
        <input type="email" required placeholder="Email" aria-label="Email" bind:value={email} class="min-w-0 flex-1 border border-ice/40 bg-transparent px-2 py-1.5" />
        <button class="bg-ice px-3 text-ink" disabled={busy}>Get code</button>
      </form>
      {#if msg}<p role="alert" class="mt-2 text-sm">{msg}</p>{/if}
    {/if}
  </aside>
{/if}
