<script lang="ts">
  import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
  import { sdk } from '$lib/medusa';
  import { money } from '$lib/format';
  import { store } from '$lib/store.svelte';
  import { goto } from '$app/navigation';

  let f = $state({ email: '', first_name: '', last_name: '', address_1: '', city: '', province: '', postal_code: '', country_code: 'us', code: '' });
  let error = $state(''), busy = $state(false), ready = $state(false);
  let stripe: Stripe | null, elements: StripeElements;
  $effect(() => { const c = store.customer; if (c && !f.email) { f.email = c.email; f.first_name ||= c.first_name ?? ''; f.last_name ||= c.last_name ?? ''; } });

  // Step 1: save address, shipping, and promo; open a Stripe payment session.
  async function prepare(e: SubmitEvent) {
    e.preventDefault(); error = ''; busy = true;
    try {
      const id = store.cart!.id;
      const { code, email, ...address } = f;
      await sdk.store.cart.update(id, { email, shipping_address: address, billing_address: address, ...(code && { promo_codes: [code] }) });
      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: id });
      await sdk.store.cart.addShippingMethod(id, { option_id: shipping_options[0].id });
      store.cart = (await sdk.store.cart.retrieve(id)).cart;
      await sdk.store.payment.initiatePaymentSession(store.cart, { provider_id: 'pp_stripe_stripe' });
      const cart = (await sdk.store.cart.retrieve(id, { fields: '*payment_collection.payment_sessions' })).cart as any;
      const secret = cart.payment_collection.payment_sessions[0].data.client_secret;
      stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
      elements = stripe!.elements({ clientSecret: secret });
      ready = true;
      queueMicrotask(() => elements.create('payment').mount('#pay'));
    } catch (err) { error = err instanceof Error ? err.message : 'Something went wrong.'; }
    busy = false;
  }
  // Step 2: confirm payment, then complete the Medusa cart into an order.
  async function pay() {
    busy = true; error = '';
    const { error: e } = await stripe!.confirmPayment({ elements, redirect: 'if_required' });
    if (e) { error = e.message ?? 'Payment failed.'; busy = false; return; }
    const res = await sdk.store.cart.complete(store.cart!.id);
    if (res.type === 'order') { store.clearCart(); goto(`/order/confirmed?order=${res.order.display_id}`); }
    else error = 'Order could not be completed.';
    busy = false;
  }
</script>

<svelte:head><title>Checkout | Driftless Genetics</title><meta name="robots" content="noindex,nofollow" /></svelte:head>
<div class="mx-auto max-w-xl p-6">
  {#if !store.cart?.items?.length}
    <p>Your cart is empty.</p>
  {:else}
    {#if !store.customer}<p class="mb-4 text-sm"><a href="/signin?next=/checkout" class="underline">Sign in</a> for faster checkout.</p>{/if}
    <form onsubmit={prepare} class="grid grid-cols-2 gap-3">
      <input class="field col-span-2" type="email" required placeholder="Email" bind:value={f.email} disabled={ready} />
      <input class="field" required placeholder="First name" bind:value={f.first_name} disabled={ready} />
      <input class="field" required placeholder="Last name" bind:value={f.last_name} disabled={ready} />
      <input class="field col-span-2" required placeholder="Address" bind:value={f.address_1} disabled={ready} />
      <input class="field" required placeholder="City" bind:value={f.city} disabled={ready} />
      <input class="field" required placeholder="State" bind:value={f.province} disabled={ready} />
      <input class="field" required placeholder="ZIP" bind:value={f.postal_code} disabled={ready} />
      <input class="field" placeholder="Discount code" bind:value={f.code} disabled={ready} />
      {#if !ready}<button class="btn col-span-2" disabled={busy}>Continue to payment</button>{/if}
    </form>
    {#if ready}
      <div id="pay" class="mt-6"></div>
      <button class="btn mt-4 w-full" onclick={pay} disabled={busy}>Pay {money(store.cart.total)}</button>
    {/if}
    {#if error}<p role="alert" class="mt-4 text-red-700">{error}</p>{/if}
  {/if}
</div>
