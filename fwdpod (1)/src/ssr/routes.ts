import { STATIC_BLOG_POSTS } from '../data/blogCatalog';

/**
 * Every indexable path, prerendered to static HTML at build time.
 *
 * Keep in sync with <Routes> in App.tsx. The prerender step fails the build if
 * a path listed here renders the not-found page.
 */
const STATIC_PATHS = [
  '/',
  '/catalogue',
  '/configure',
  '/live-pods',
  '/insights',
  '/contact',
  '/services/ai-development',
  '/services/llm-development',
  '/services/rag-development',
  '/services/ai-agents',
  '/services/team-augmentation',
  '/services/ai-consulting',
];

export interface PrerenderRoute {
  path: string;
  /** ISO 8601 date the content last changed, when known. */
  lastmod?: string;
}

export function getPrerenderRoutes(): PrerenderRoute[] {
  return [
    ...STATIC_PATHS.map(path => ({ path })),
    // Every published article in content/blog/ gets its own page and sitemap entry.
    // Placeholder cards are not included: they have no article behind them.
    ...STATIC_BLOG_POSTS.map(post => ({ path: `/insights/${post.slug}`, lastmod: post.isoDate })),
  ];
}
