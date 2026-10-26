import Medusa from '@medusajs/js-sdk';
import { PUBLIC_MEDUSA_URL, PUBLIC_MEDUSA_PUBLISHABLE_KEY } from '$env/static/public';

export const sdk = new Medusa({ baseUrl: PUBLIC_MEDUSA_URL, publishableKey: PUBLIC_MEDUSA_PUBLISHABLE_KEY });

let regionPromise: ReturnType<typeof load> | undefined;
const load = async () => (await sdk.store.region.list()).regions[0];
export const region = () => (regionPromise ??= load());

export async function listProducts() {
  const r = await region();
  return (await sdk.store.product.list({ region_id: r.id, fields: '*variants.calculated_price' })).products;
}
export async function getProduct(handle: string) {
  const r = await region();
  const { products } = await sdk.store.product.list({ handle, region_id: r.id, fields: '*variants.calculated_price' });
  return products[0];
}
