import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from './SEO';
import NotFoundView from './NotFoundView';
import BlogImage from './blog/BlogImage';
import { buildArticleSchema } from './blog/blogSchema';
import { getPostBySlug } from '../data/blogCatalog';

/**
 * Article page at /blog/:slug.
 *
 * The body is the markdown from the post's .md file. Placeholder cards have no
 * body, so they render a short notice instead — the routing, metadata and
 * schema are already in place for when the real article arrives.
 */
export default function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <NotFoundView />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-3xl mx-auto space-y-8 text-[#0A0A0A]"
    >
      <SEO
        title={`${post.title} | Fwdpod Insights`}
        description={post.excerpt}
        ogType="article"
        articlePublishedTime={post.isoDate}
        ogImage={post.image ? `https://www.fwdpod.com${post.image}` : undefined}
        jsonLd={buildArticleSchema(post)}
      />

      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors pb-2 border-b border-zinc-100"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all insights</span>
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#0066FF] bg-[#0066FF]/5 px-2.5 py-0.5 rounded-full font-semibold inline-block">
            {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-sm text-[#555555] leading-relaxed">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 pt-1">
            <span>{post.author}</span>
            <span>{post.date}</span>
            {post.readTime ? <span>{post.readTime}</span> : null}
          </div>
        </header>

        {post.image && (
          <BlogImage post={post} aspect="aspect-[16/9]" priority className="rounded-3xl" />
        )}

        {post.content ? (
          <div className="prose prose-zinc max-w-none text-zinc-800 font-serif text-[15px] sm:text-[16px] leading-relaxed space-y-6 pt-4 border-t border-zinc-100">
            {renderMarkdown(post.content)}
          </div>
        ) : (
          <div className="border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 p-12 text-center">
            <p className="text-xs text-zinc-400 font-mono">
              This article has not been written yet.
            </p>
          </div>
        )}
      </article>
    </motion.div>
  );
}

/** Minimal markdown: headings, bullet and numbered lists, paragraphs. */
function renderMarkdown(markdown: string) {
  return markdown.split('\n\n').map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={index} className="text-lg md:text-xl font-sans font-semibold text-zinc-900 tracking-tight pt-4">
          {trimmed.slice(4).trim()}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={index} className="text-xl md:text-2xl font-sans font-bold text-zinc-900 tracking-tight pt-5 border-b border-zinc-100 pb-2">
          {trimmed.slice(3).trim()}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      // The post title is already this page's <h1>
      return (
        <h2 key={index} className="text-2xl md:text-3xl font-sans font-bold text-zinc-900 tracking-tight pt-5">
          {trimmed.slice(2).trim()}
        </h2>
      );
    }
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      return (
        <ul key={index} className="space-y-2.5 font-sans pl-5 list-disc text-sm text-zinc-700">
          {trimmed.split('\n').map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line.replace(/^[*-]\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }
    if (/^\d+\./.test(trimmed)) {
      return (
        <ol key={index} className="space-y-2.5 font-sans pl-5 list-decimal text-sm text-zinc-700">
          {trimmed.split('\n').map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line.replace(/^\d+[.)]\s*/, '')}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={index} className="whitespace-pre-line leading-relaxed">
        {trimmed}
      </p>
    );
  });
}
