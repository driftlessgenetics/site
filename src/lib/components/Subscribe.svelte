<script lang="ts">
  import { site } from '$lib/site';
  let email = $state(''), msg = $state('');
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const r = await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    msg = r.ok ? 'Check your inbox for your code.' : 'Could not subscribe. Check the address and try again.';
  }
</script>

<form onsubmit={submit} class="flex flex-wrap items-center gap-3">
  <label for="sub" class="font-display text-2xl">{site.discount} off your first order</label>
  <input id="sub" type="email" required bind:value={email} placeholder="Email" class="field max-w-xs bg-ink! border-ice! text-ice" />
  <button class="bg-ice px-5 py-2.5 text-ink">Get code</button>
  {#if msg}<p role="status" class="w-full text-sm">{msg}</p>{/if}
</form>
