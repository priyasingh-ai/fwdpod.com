import type { BlogPost } from '../../data/blogCatalog';

interface BlogImageProps {
  post: BlogPost;
  /** Tailwind aspect ratio utility, so cards and the featured slot can differ. */
  aspect?: string;
  /** The featured image loads eagerly; grid images stay lazy. */
  priority?: boolean;
  className?: string;
}

/**
 * One image area for every card, so swapping in real artwork is just the
 * `image` field in a post's frontmatter (file goes in public/blog-images/).
 * Without one, a plain brand-tinted panel keeps the card's shape.
 *
 * Images live in public/blog-images/, not public/blog/: a real directory named
 * after a route makes Apache redirect /blog to /blog/ before the rewrite rules
 * run, which breaks the page.
 */
export default function BlogImage({
  post,
  aspect = 'aspect-[16/10]',
  priority = false,
  className = '',
}: BlogImageProps) {
  if (post.image) {
    return (
      <img
        src={post.image}
        alt={post.imageAlt ?? post.title}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`w-full ${aspect} object-cover bg-zinc-100 ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`w-full ${aspect} bg-[#0066FF]/5 border-b border-[#0A0A0A]/5 flex items-center justify-center ${className}`}
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#0066FF]/50">
        {post.category}
      </span>
    </div>
  );
}
