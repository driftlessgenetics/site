import type { HttpTypes } from '@medusajs/types';
import { sdk, region } from './medusa';

class Store {
  cart = $state<HttpTypes.StoreCart | null>(null);
  customer = $state<HttpTypes.StoreCustomer | null>(null);
  count = $derived(this.cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0);

  async init() {
    const id = localStorage.getItem('cart_id');
    if (id) this.cart = await sdk.store.cart.retrieve(id).then((r) => r.cart).catch(() => null);
    this.customer = await sdk.store.customer.retrieve().then((r) => r.customer).catch(() => null);
    // Attach a guest cart to the customer after sign-in so checkout keeps their account.
    if (this.customer && this.cart && !this.cart.customer_id)
      this.cart = await sdk.store.cart.transferCart(this.cart.id).then((r) => r.cart).catch(() => this.cart);
  }
  async add(variant_id: string) {
    if (!this.cart) {
      const { cart } = await sdk.store.cart.create({ region_id: (await region()).id });
      localStorage.setItem('cart_id', cart.id);
      this.cart = cart;
    }
    this.cart = (await sdk.store.cart.createLineItem(this.cart.id, { variant_id, quantity: 1 })).cart;
  }
  async setQty(line_id: string, quantity: number) {
    if (!this.cart) return;
    this.cart = quantity < 1
      ? (await sdk.store.cart.deleteLineItem(this.cart.id, line_id)).parent!
      : (await sdk.store.cart.updateLineItem(this.cart.id, line_id, { quantity })).cart;
  }
  async signIn(next = location.pathname) {
    sessionStorage.setItem('next', next);
    const r = await sdk.auth.login('customer', 'google', {});
    if (typeof r === 'object' && 'location' in r) location.href = r.location;
  }
  async signInEmail(email: string, password: string) {
    await sdk.auth.login('customer', 'emailpass', { email, password });
    await this.init();
  }
  async register(email: string, password: string) {
    const token = await sdk.auth.register('customer', 'emailpass', { email, password });
    await sdk.store.customer.create({ email }, {}, { Authorization: `Bearer ${token}` });
    await this.signInEmail(email, password);
  }
  async signOut() { await sdk.auth.logout(); this.customer = null; }
  clearCart() { localStorage.removeItem('cart_id'); this.cart = null; }
}
export const store = new Store();
