/**
 * Blog data layer.
 *
 * Articles are markdown files in content/blog/, read at build time. To publish,
 * drop in a .md file with this frontmatter and rebuild — routing, the listing,
 * the sitemap and the article page all follow automatically:
 *
 *   ---
 *   title: "Your Post Title"
 *   meta_description: "Shown as the card excerpt and the meta description."
 *   slug: your-post-title
 *   category: AI Development          # one of BLOG_CATEGORIES below
 *   date: 2026-09-23                  # YYYY-MM-DD
 *   image: /blog-images/your-post.jpg # optional, file goes in public/blog-images/
 *   featured: true                    # optional, one post at a time
 *   ---
 */
import { PLACEHOLDER_POSTS } from './blogPlaceholders';

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    name: 'AI Engineering Pods',
    slug: 'ai-engineering-pods',
    description: 'Pre-assembled AI teams, pod models, and delivery structures',
  },
  {
    name: 'AI Development',
    slug: 'ai-development',
    description: 'Building AI products from idea to production',
  },
  {
    name: 'AI Agents',
    slug: 'ai-agents',
    description: 'Agentic AI, multi-agent systems, and enterprise orchestration',
  },
  {
    name: 'LLM Development',
    slug: 'llm-development',
    description: 'Custom LLM applications and enterprise LLM use cases',
  },
  {
    name: 'RAG Development',
    slug: 'rag-development',
    description: 'Retrieval-augmented generation and enterprise knowledge systems',
  },
  {
    name: 'AI Leadership & Consulting',
    slug: 'ai-leadership-consulting',
    description: 'Fractional AI leadership, CAIO, and organizational AI strategy',
  },
  {
    name: 'Startup & Business',
    slug: 'startup-business',
    description: 'Building AI teams and products at startup speed',
  },
  {
    name: 'Enterprise AI Strategy',
    slug: 'enterprise-ai-strategy',
    description: 'Enterprise AI adoption, governance, and AI org structure',
  },
  {
    name: 'AI Talent & Team Building',
    slug: 'ai-talent-team-building',
    description: 'Hiring AI engineers, team models, and talent strategy',
  },
  {
    name: 'AI Product Delivery',
    slug: 'ai-product-delivery',
    description: 'AI delivery teams, product lifecycle, and ROI measurement',
  },
  {
    name: 'Industry AI Use Cases',
    slug: 'industry-ai-use-cases',
    description: 'AI applications in healthcare, finance, SaaS, and mid-market',
  },
  {
    name: 'Thought Leadership',
    slug: 'thought-leadership',
    description: 'Future of AI engineering, strategic perspectives, and industry trends',
  },
];

// Maps legacy markdown category names to the new taxonomy
const CATEGORY_ALIASES: Record<string, string> = {
  'Fractional AI Leadership': 'AI Leadership & Consulting',
  'Industry-Specific AI': 'Industry AI Use Cases',
};

export function normalizeCategory(raw: string): string {
  return CATEGORY_ALIASES[raw] ?? raw;
}

export function getCategorySlug(categoryName: string): string {
  return (
    BLOG_CATEGORIES.find(c => c.name === categoryName)?.slug ??
    categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  );
}

export function getCategoryFromSlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find(c => c.slug === slug);
}

export interface BlogPost {
  id: string;
  title: string;
  /** URL segment: the post is served at /blog/<slug>. */
  slug: string;
  category: string;
  /** One or two sentences, used on the card and as the meta description. */
  excerpt: string;
  /** Markdown body. Empty for placeholders. */
  content: string;
  /** Display date, e.g. "Sep 23, 2026". */
  date: string;
  /** YYYY-MM-DD, for schema and <lastmod>. */
  isoDate?: string;
  readTime: string;
  author: string;
  /** Path under public/, e.g. /blog-images/my-post.jpg. Falls back to a panel. */
  image?: string;
  /** Marks the one post shown in the featured slot. */
  featured?: boolean;
  /** True for the stand-in cards shown while no articles exist. */
  placeholder?: boolean;
}

/** Kept for callers that predate the BlogPost rename. */
export type StaticBlogPost = BlogPost;

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: match[2].trim() };
}

function formatDate(d: string): string {
  return new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function estimateReadTime(text: string): string {
  const mins = Math.max(4, Math.ceil(text.trim().split(/\s+/).length / 200));
  return `${mins} min read`;
}

// Load all markdown files eagerly at build time via Vite glob import
const rawFiles = import.meta.glob('../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const STATIC_BLOG_POSTS: BlogPost[] = Object.entries(rawFiles)
  .map(([, raw]) => {
    const parsed = parseFrontmatter(raw);
    if (!parsed) return null;
    const { meta, body } = parsed;
    if (!meta.slug || !meta.category) return null;
    return {
      id: `static-${meta.slug}`,
      title: meta.title ?? meta.slug,
      slug: meta.slug,
      category: normalizeCategory(meta.category),
      excerpt: meta.meta_description ?? '',
      content: body,
      date: meta.date ? formatDate(meta.date) : '',
      isoDate: meta.date && !Number.isNaN(Date.parse(meta.date)) ? meta.date : undefined,
      readTime: estimateReadTime(body),
      author: 'Fwdpod',
      image: meta.image || undefined,
      featured: meta.featured === 'true',
    } as BlogPost;
  })
  .filter((p): p is BlogPost => p !== null)
  .sort((a, b) => (b.isoDate ?? '').localeCompare(a.isoDate ?? '') || a.title.localeCompare(b.title));

/**
 * Posts for the listing and the article pages: real articles once any exist,
 * otherwise the placeholder cards, so the layout can be reviewed before the
 * content lands. Adding one .md file replaces every placeholder.
 */
export function getAllPosts(): BlogPost[] {
  return STATIC_BLOG_POSTS.length > 0 ? STATIC_BLOG_POSTS : PLACEHOLDER_POSTS;
}

/** The post shown in the featured slot: the flagged one, else the newest. */
export function getFeaturedPost(posts: BlogPost[] = getAllPosts()): BlogPost | undefined {
  return posts.find(p => p.featured) ?? posts[0];
}

/** Everything except the featured post, in listing order. */
export function getListingPosts(posts: BlogPost[] = getAllPosts()): BlogPost[] {
  const featured = getFeaturedPost(posts);
  return posts.filter(p => p.id !== featured?.id);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}

/** True while the listing is showing stand-in cards rather than real articles. */
export const USING_PLACEHOLDERS = STATIC_BLOG_POSTS.length === 0;
