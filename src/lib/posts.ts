type Meta = { title: string; date: string; summary: string };
const modules = import.meta.glob<{ metadata: Meta }>('/src/posts/*.md', { eager: true });

// Add a post by dropping a .md file in src/posts with title, date, summary frontmatter.
export const posts = Object.entries(modules)
  .map(([path, m]) => ({ slug: path.split('/').pop()!.replace('.md', ''), ...m.metadata }))
  .sort((a, b) => b.date.localeCompare(a.date));
