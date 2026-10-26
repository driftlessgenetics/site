import { error } from '@sveltejs/kit';
import { posts } from '$lib/posts';
export const prerender = true;
export const entries = () => posts.map((p) => ({ slug: p.slug }));
export const load = async ({ params }) => {
  try {
    const post = await import(`../../../posts/${params.slug}.md`);
    return { component: post.default };
  } catch {
    error(404, 'Post not found');
  }
};
