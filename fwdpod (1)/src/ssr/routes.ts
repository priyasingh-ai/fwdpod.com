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
  '/blog',
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
  ];
}
