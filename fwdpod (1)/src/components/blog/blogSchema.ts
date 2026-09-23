import type { BlogPost } from '../../data/blogCatalog';
import { SITE_BASE_URL, SITE_NAME } from '../SEO';

export const BLOG_TITLE = 'AI Engineering Insights & LLM Development Blog | Fwdpod';
export const BLOG_DESCRIPTION =
  'Deep-dives into LLM agent architectures, RAG systems, voice AI pipelines, enterprise compliance AI, and the economics of productised AI engineering teams.';

export function postUrl(post: BlogPost): string {
  return `${SITE_BASE_URL}/blog/${post.slug}`;
}

function postAuthor(post: BlogPost) {
  return post.author === SITE_NAME
    ? { '@id': `${SITE_BASE_URL}/#organization` }
    : { '@type': 'Person', name: post.author };
}

/** Listing page: the Blog entity and the posts it shows. */
export function buildBlogListSchema(posts: BlogPost[]) {
  const pageUrl = `${SITE_BASE_URL}/blog`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_BASE_URL}/#blog`,
        url: pageUrl,
        name: BLOG_TITLE,
        description: BLOG_DESCRIPTION,
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: pageUrl },
          ],
        },
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_BASE_URL}/#blog-entity`,
        name: 'Fwdpod Insights',
        publisher: { '@id': `${SITE_BASE_URL}/#organization` },
        // Placeholder cards carry no real article, so they stay out of schema
        blogPost: posts
          .filter(post => !post.placeholder)
          .map(post => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            author: postAuthor(post),
            datePublished: post.isoDate,
            url: postUrl(post),
            keywords: post.category,
          })),
      },
    ],
  };
}

/** Article page. */
export function buildArticleSchema(post: BlogPost) {
  const url = postUrl(post);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${post.title} | Fwdpod Insights`,
        description: post.excerpt,
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        },
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        articleBody: post.content,
        articleSection: post.category,
        author: postAuthor(post),
        publisher: { '@id': `${SITE_BASE_URL}/#organization` },
        datePublished: post.isoDate,
        image: post.image ? `${SITE_BASE_URL}${post.image}` : undefined,
        url,
        inLanguage: 'en-US',
      },
    ],
  };
}
