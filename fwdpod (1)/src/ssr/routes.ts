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
  '/contact',
  '/services/ai-development',
  '/services/llm-development',
  '/services/rag-development',
  '/services/ai-agents',
  '/services/team-augmentation',
  '/services/ai-consulting',
];

/**
 * Prerendered so the URLs work and stay linkable, but marked noindex and kept out
 * of the sitemap: /live-pods shows illustrative sample data and /blog has no
 * articles yet.
 */
const NOINDEX_PATHS = ['/live-pods', '/blog'];

export interface PrerenderRoute {
  path: string;
  /** ISO 8601 date the content last changed, when known. */
  lastmod?: string;
  /** Rendered, but excluded from the sitemap and expected to be noindex. */
  noindex?: boolean;
}

export function getPrerenderRoutes(): PrerenderRoute[] {
  return [
    ...STATIC_PATHS.map(path => ({ path })),
    ...NOINDEX_PATHS.map(path => ({ path, noindex: true })),
  ];
}
