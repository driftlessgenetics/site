import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';

export default {
  extensions: ['.svelte', '.md'],
  // Every .md file (blog posts and legal pages) is wrapped in Prose.svelte.
  preprocess: [mdsvex({ extensions: ['.md'], layout: './src/lib/components/Prose.svelte' })],
  kit: { adapter: adapter() }
};
