import { Link } from 'react-router-dom';
import type { BlogPost } from '../../data/blogCatalog';
import { postPath } from '../../data/blogCatalog';
import BlogImage from './BlogImage';

/**
 * The lead article: content left, image right on wide screens, stacked below
 * xl. Mark a post with `featured: true` in its frontmatter to put it here;
 * otherwise the newest post takes the slot.
 *
 * The image column must never be taller than the image, or the panel shows as
 * bands above and below it — and since the text column's height depends on
 * the title and excerpt, that happened for some posts and not others. Below xl
 * the card stacks, so the column is the image's own 16:9. From xl the image
 * takes 3/5 of the width and its 16:9 sets the row height; the text is shorter
 * than that at every xl width, and if a long title ever outgrows it the image
 * fills the extra height rather than leaving a band.
 */
export default function FeaturedBlog({ post }: { post: BlogPost }) {
  return (
    <section aria-labelledby="featured-heading" className="space-y-4">
      <h2
        id="featured-heading"
        className="text-[10px] font-mono uppercase tracking-widest text-[#555555] font-semibold"
      >
        Featured article
      </h2>

      <article>
        <Link
          to={postPath(post)}
          className="group grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-0 bg-white border border-zinc-200/85 rounded-3xl overflow-hidden shadow-sm hover:border-[#0066FF] hover:shadow-md transition-all duration-300 ease-out"
        >
          <div className="flex flex-col justify-center gap-4 p-8 md:p-10 order-2 xl:order-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#0066FF] bg-[#0066FF]/5 px-2.5 py-0.5 rounded-full font-semibold self-start">
              {post.category}
            </span>

            <h3 className="text-2xl md:text-3xl font-display font-medium text-[#0A0A0A] leading-tight tracking-tight group-hover:text-[#0066FF] transition-colors">
              {post.title}
            </h3>

            <p className="text-sm text-[#555555] leading-relaxed line-clamp-3 max-w-xl">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 pt-1">
              <span>{post.date}</span>
              {post.readTime ? <span>{post.readTime}</span> : null}
            </div>

            <span className="text-xs font-semibold text-[#0066FF] flex items-center gap-1.5 pt-1">
              Read article
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </div>

          <div className="order-1 xl:order-2 relative xl:aspect-[16/9]">
            <BlogImage
              post={post}
              aspect="aspect-[16/9] xl:aspect-auto xl:absolute xl:inset-0 xl:h-full"
              priority
              className="xl:object-cover"
            />
          </div>
        </Link>
      </article>
    </section>
  );
}
