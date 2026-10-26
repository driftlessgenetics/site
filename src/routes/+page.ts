import { listProducts } from '$lib/medusa';
export const load = async () => ({ products: await listProducts() });
