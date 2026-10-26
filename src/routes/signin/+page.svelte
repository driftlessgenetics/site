<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { store } from '$lib/store.svelte';
  const next = $derived.by(() => { const n = page.url.searchParams.get('next') ?? '/account'; return n.startsWith('/') && !n.startsWith('//') ? n : '/account'; });
  let mode = $state<'in' | 'up'>('in'), email = $state(''), password = $state(''), error = $state(''), busy = $state(false);
  async function submit(e: SubmitEvent) {
    e.preventDefault(); busy = true; error = '';
    try { await (mode === 'in' ? store.signInEmail(email, password) : store.register(email, password)); goto(next); }
    catch { error = mode === 'in' ? 'Email or password is incorrect.' : 'Could not create the account. The email may already be registered.'; }
    busy = false;
  }
</script>

<svelte:head><title>{mode === 'in' ? 'Sign in' : 'Create account'} | Driftless Genetics</title><meta name="robots" content="noindex,nofollow" /></svelte:head>
<div class="mx-auto max-w-sm p-6 py-16">
  <h1 class="font-display text-3xl">{mode === 'in' ? 'Sign in' : 'Create account'}</h1>
  <form onsubmit={submit} class="mt-6 grid gap-3">
    <input class="field" type="email" required autocomplete="email" placeholder="Email" bind:value={email} />
    <input class="field" type="password" required minlength={mode === 'up' ? 8 : undefined} autocomplete={mode === 'in' ? 'current-password' : 'new-password'} placeholder="Password" bind:value={password} />
    <button class="btn" disabled={busy}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>
    {#if error}<p role="alert" class="text-red-700">{error}</p>{/if}
  </form>
  <button class="mt-3 border border-ink px-5 py-2.5 w-full" onclick={() => store.signIn(next)}>Continue with Google</button>
  <button class="mt-6 underline" onclick={() => (mode = mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'Create an account' : 'I have an account'}</button>
</div>
