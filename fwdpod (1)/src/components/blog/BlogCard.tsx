import { Link } from 'react-router-dom';
import type { BlogPost } from '../../data/blogCatalog';
import BlogImage from './BlogImage';

/**
 * One article in the grid. The whole card is a single link, so the click
 * target matches what the reader sees.
 */
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="group h-full flex flex-col bg-white border border-zinc-200/85 rounded-3xl overflow-hidden shadow-sm hover:border-[#0066FF] hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 ease-out"
      >
        <BlogImage post={post} />

        <div className="flex flex-col flex-1 gap-3 p-6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#0066FF] bg-[#0066FF]/5 px-2.5 py-0.5 rounded-full font-semibold self-start">
            {post.category}
          </span>

          <h3 className="text-lg font-display font-medium text-[#0A0A0A] leading-snug tracking-tight line-clamp-2 group-hover:text-[#0066FF] transition-colors">
            {post.title}
          </h3>

          <p className="text-xs text-[#555555] leading-relaxed line-clamp-3 font-sans">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>
              {post.date}
              {post.readTime ? ` // ${post.readTime}` : ''}
            </span>
            <span className="text-[#0066FF] font-semibold group-hover:translate-x-0.5 transition-transform">
              Read →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
