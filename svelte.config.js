import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

// mdsvex needs one absolute path that works for both reading and importing the layout.
// Forward slashes keep it valid on Windows.
const layout = fileURLToPath(new URL('./src/lib/components/Prose.svelte', import.meta.url)).replace(/\\/g, '/');

export default {
  extensions: ['.svelte', '.md'],
  // Every .md file (blog posts and legal pages) is wrapped in Prose.svelte.
  preprocess: [mdsvex({ extensions: ['.md'], layout })],
  kit: { adapter: adapter() }
};
