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

export interface StaticBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  /** Publication date (YYYY-MM-DD) from frontmatter, for schema and sitemaps. */
  isoDate?: string;
  readTime: string;
  author: string;
}

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

export const STATIC_BLOG_POSTS: StaticBlogPost[] = Object.entries(rawFiles)
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
      date: meta.date ? formatDate(meta.date) : 'Jun 12, 2026',
      isoDate: meta.date && !Number.isNaN(Date.parse(meta.date)) ? meta.date : undefined,
      readTime: estimateReadTime(body),
      author: 'Fwdpod',
    } as StaticBlogPost;
  })
  .filter((p): p is StaticBlogPost => p !== null)
  .sort((a, b) => a.title.localeCompare(b.title));
