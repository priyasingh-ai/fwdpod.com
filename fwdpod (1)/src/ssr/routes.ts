import { getCategoriesWithCounts, STATIC_BLOG_POSTS } from '../data/blogCatalog';
import { CATEGORY_PAGE_SIZE, categoryPath } from '../data/blogCategories';

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
  /**
   * False for pages that are rendered and reachable but deliberately kept out
   * of the index and the sitemap — an empty category page, for now.
   */
  indexable?: boolean;
}

export function getPrerenderRoutes(): PrerenderRoute[] {
  return [
    ...STATIC_PATHS.map(path => ({ path })),
    // Every published article in content/blog/ gets its own page and sitemap entry.
    // Placeholder cards are not included: they have no article behind them.
    ...STATIC_BLOG_POSTS.map(post => ({ path: `/insights/${post.slug}`, lastmod: post.isoDate })),
    // All five categories are rendered so every chip on the filter bar leads
    // to a real page. One with no posts yet is noindex and, being unindexable,
    // never reaches the sitemap.
    ...getCategoriesWithCounts(STATIC_BLOG_POSTS).flatMap(category =>
      Array.from(
        { length: Math.max(1, Math.ceil(category.count / CATEGORY_PAGE_SIZE)) },
        (_, index) => ({
          path: categoryPath(category.slug, index + 1),
          lastmod: category.lastmod,
          indexable: category.count > 0,
        })
      )
    ),
  ];
}
