<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { sdk } from '$lib/medusa';
  import { store } from '$lib/store.svelte';
  let error = $state('');
  const decode = (t: string) => JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

  onMount(async () => {
    try {
      const token = await sdk.auth.callback('customer', 'google', Object.fromEntries(new URLSearchParams(location.search)));
      const claims = decode(token);
      if (!claims.actor_id) { // first sign-in: create the customer record
        await sdk.store.customer.create({ email: claims.user_metadata?.email }, {}, { Authorization: `Bearer ${token}` });
        await sdk.auth.refresh({ Authorization: `Bearer ${token}` });
      }
      await store.init();
      const next = sessionStorage.getItem('next') || '/account';
      sessionStorage.removeItem('next');
      goto(next);
    } catch { error = 'Sign in failed. Try again.'; }
  });
</script>
<p class="p-10 text-center" role="status">{error || 'Signing in'}</p>
