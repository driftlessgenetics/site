import { error } from '@sveltejs/kit';
import { getProduct } from '$lib/medusa';
export const load = async ({ params }) => {
  const product = await getProduct(params.handle);
  if (!product) error(404, 'Product not found');
  return { product };
};
