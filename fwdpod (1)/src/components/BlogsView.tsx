import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  trackSearchPerformed,
  trackBlogPostView,
  trackBlogCategoryFilter,
} from '../utils/analytics';
import {
  BookOpen,
  Plus,
  Search,
  Clock,
  ArrowLeft,
  X,
} from 'lucide-react';
import SEO, { SITE_BASE_URL, SITE_NAME } from './SEO';
import NotFoundView from './NotFoundView';
import {
  BLOG_CATEGORIES,
  STATIC_BLOG_POSTS,
  getCategorySlug,
  getCategoryFromSlug,
} from '../data/blogCatalog';

// ─── Schema builders ──────────────────────────────────────────────────────────

function postUrl(post: BlogPost): string {
  // Only static posts have a public URL; user-created posts live in localStorage
  return post.slug ? `${SITE_BASE_URL}/blog/${post.slug}` : `${SITE_BASE_URL}/blog`;
}

function postAuthor(post: BlogPost) {
  return post.author === SITE_NAME
    ? { '@id': `${SITE_BASE_URL}/#organization` }
    : { '@type': 'Person', name: post.author };
}

function buildBlogListSchema(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_BASE_URL}/#blog`,
        url: `${SITE_BASE_URL}/blog`,
        name: 'AI Engineering Insights & LLM Development Blog | Fwdpod',
        description:
          'Deep-dives into LLM agent architectures, RAG systems, voice AI pipelines, enterprise compliance AI, and the economics of productised AI engineering teams.',
        isPartOf: { '@id': `${SITE_BASE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_BASE_URL}/blog` },
          ],
        },
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_BASE_URL}/#blog-entity`,
        name: 'Fwdpod Insights',
        description:
          'Technical articles on AI engineering, LLM development, RAG systems, and enterprise AI product delivery from the Fwdpod team.',
        publisher: { '@id': `${SITE_BASE_URL}/#organization` },
        blogPost: posts.map(post => ({
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

function buildArticleSchema(post: BlogPost) {
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
        url,
        inLanguage: 'en-US',
        keywords: `AI engineering, ${post.category.toLowerCase()}, LLM development, Fwdpod`,
      },
    ],
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  createdAt: string;
  /** Set for static catalog posts, which are served at /blog/:slug. */
  slug?: string;
  isoDate?: string;
}

// IDs of the original seeded demo posts — filtered out of localStorage on load
const LEGACY_DEFAULT_IDS = new Set([
  'scaling-ai-agents',
  'economics-of-pods',
  'low-latency-voice',
  'compliance-isolation',
]);

// Convert static catalog posts into the BlogPost display format
const STATIC_DISPLAY_POSTS: BlogPost[] = STATIC_BLOG_POSTS.map(p => ({
  id: p.id,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  category: p.category,
  author: p.author,
  readTime: p.readTime,
  createdAt: p.date,
  slug: p.slug,
  isoDate: p.isoDate,
}));

// ─── Component ────────────────────────────────────────────────────────────────

// Static posts link to their own URL; user-created posts open in place
function PostLink({
  post,
  onOpen,
  className,
  children,
}: {
  post: BlogPost;
  onOpen: (id: string) => void;
  className: string;
  children: React.ReactNode;
}) {
  if (post.slug) {
    return (
      <Link to={`/blog/${post.slug}`} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={() => onOpen(post.id)} className={className}>
      {children}
    </button>
  );
}

export default function BlogsView() {
  const { categorySlug, slug } = useParams<{ categorySlug?: string; slug?: string }>();
  const navigate = useNavigate();

  // User-created posts stored in localStorage (not the static catalog)
  const [customBlogs, setCustomBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => (categorySlug && getCategoryFromSlug(categorySlug)?.name) || 'All',
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create Blog modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newExcerpt, setNewExcerpt] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>(BLOG_CATEGORIES[0].name);
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newReadTime, setNewReadTime] = useState<string>('4 min read');
  const [formError, setFormError] = useState<string>('');

  // Active detail view (null = listing)
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);

  // All posts: static catalog first, then user-created on top
  const allBlogs = useMemo(
    () => [...customBlogs, ...STATIC_DISPLAY_POSTS],
    [customBlogs],
  );

  // Category post counts (derived from allBlogs)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of BLOG_CATEGORIES) {
      counts[cat.name] = allBlogs.filter(b => b.category === cat.name).length;
    }
    return counts;
  }, [allBlogs]);

  // Load user-created posts from localStorage; strip legacy demo seeds
  useEffect(() => {
    const cached = localStorage.getItem('FWDPOD_BLOGS');
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as BlogPost[];
      const userPosts = parsed
        .filter(b => !LEGACY_DEFAULT_IDS.has(b.id) && !b.id.startsWith('static-'))
        .map(b =>
          b.author?.toLowerCase().includes('ayush')
            ? { ...b, author: b.author.replace(/Ayush,\s*/gi, '').replace(/Ayush/gi, 'Founder') || 'Founder' }
            : b,
        );
      setCustomBlogs(userPosts);
      localStorage.setItem('FWDPOD_BLOGS', JSON.stringify(userPosts));
    } catch {
      // ignore malformed data
    }
  }, []);

  // Sync category from URL param
  useEffect(() => {
    if (categorySlug) {
      const cat = getCategoryFromSlug(categorySlug);
      setSelectedCategory(cat ? cat.name : 'All');
    } else {
      setSelectedCategory('All');
    }
  }, [categorySlug]);

  // Derived filtered list — must be declared before the search useEffect that reads .length
  const filteredBlogs = allBlogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      blog.title.toLowerCase().includes(q) ||
      blog.excerpt.toLowerCase().includes(q) ||
      blog.content.toLowerCase().includes(q) ||
      blog.author.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Static posts are addressed by URL (/blog/:slug); user-created posts only
  // exist in this browser's localStorage, so they still open in place
  const routePost = slug ? STATIC_DISPLAY_POSTS.find(p => p.slug === slug) : undefined;
  const activeBlogDetail =
    routePost ?? (activeBlogId ? allBlogs.find(b => b.id === activeBlogId) : undefined);

  // Track blog post detail view when a post is opened
  useEffect(() => {
    if (activeBlogDetail) trackBlogPostView(activeBlogDetail.title, activeBlogDetail.category);
  }, [activeBlogDetail?.id]);

  // Track search queries with 800ms debounce (min 2 chars)
  useEffect(() => {
    if (searchQuery.length < 2) return;
    const timer = setTimeout(() => {
      trackSearchPerformed(searchQuery, filteredBlogs.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredBlogs.length]);

  const categoryPath = (cat: string) =>
    cat === 'All' ? '/blog' : `/blog/category/${getCategorySlug(cat)}`;

  // Category pills are links; this runs before the link navigates
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveBlogId(null);
    trackBlogCategoryFilter(cat);
  };

  const handleCategorySelect = (cat: string) => {
    handleCategoryClick(cat);
    navigate(categoryPath(cat), { replace: true });
  };

  const saveCustomBlogs = (updated: BlogPost[]) => {
    setCustomBlogs(updated);
    localStorage.setItem('FWDPOD_BLOGS', JSON.stringify(updated));
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newTitle.trim() || !newExcerpt.trim() || !newContent.trim() || !newAuthor.trim()) {
      setFormError('Please fill out all required fields to submit.');
      return;
    }
    const newBlog: BlogPost = {
      id: `custom-blog-${Date.now()}`,
      title: newTitle.trim(),
      excerpt: newExcerpt.trim(),
      content: newContent.trim(),
      category: newCategory,
      author: newAuthor.trim(),
      readTime: newReadTime.trim() || '4 min read',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    saveCustomBlogs([newBlog, ...customBlogs]);
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    setNewCategory(BLOG_CATEGORIES[0].name);
    setNewAuthor('');
    setNewReadTime('4 min read');
    setIsModalOpen(false);
  };

  if (slug && !routePost) return <NotFoundView />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-12 text-[#0A0A0A]"
    >
      {/* Dynamic SEO */}
      {activeBlogDetail ? (
        <SEO
          title={`${activeBlogDetail.title} | Fwdpod Insights`}
          description={activeBlogDetail.excerpt}
          canonical={activeBlogDetail.slug ? `/blog/${activeBlogDetail.slug}` : '/blog'}
          ogType="article"
          articlePublishedTime={activeBlogDetail.isoDate}
          jsonLd={buildArticleSchema(activeBlogDetail)}
        />
      ) : (
        <SEO
          title="AI Engineering Insights &amp; LLM Development Blog | Fwdpod"
          description="Deep-dives into LLM agent architectures, RAG systems, voice AI pipelines, enterprise compliance AI, and the economics of productised AI engineering teams."
          canonical="/blog"
          jsonLd={buildBlogListSchema(allBlogs)}
        />
      )}

      <AnimatePresence mode="wait">
        {!activeBlogDetail ? (
          /* ==================== LISTING VIEW ==================== */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#0066FF] uppercase tracking-widest font-semibold block">
                  Knowledge Hub // Aligned Insights
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-[#0A0A0A] tracking-tight">
                  Fwdpod Insights
                </h1>
                <p className="text-sm text-[#555555] max-w-xl leading-relaxed">
                  Deep-dives into cognitive engineering architectures, enterprise multi-agent loops, compliance isolation, and the modern economics of modular code delivery.
                </p>
              </div>

              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0066FF] hover:bg-[#0055DD] text-white text-xs font-semibold px-5 py-3 rounded-full flex items-center gap-2 shadow-sm hover:shadow transition-all self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write new post</span>
                </button>
              </div>
            </section>

            {/* Filter and Search Bar */}
            <section className="bg-zinc-50 border border-[#0A0A0A]/10 p-4 rounded-3xl flex flex-col gap-4">
              {/* Category filter pills */}
              <div className="flex flex-wrap gap-2">
                <Link
                  to={categoryPath('All')}
                  replace
                  onClick={() => handleCategoryClick('All')}
                  className={`text-xs px-4 py-2 transition-all duration-200 rounded-full font-medium whitespace-nowrap ${
                    selectedCategory === 'All'
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'bg-white text-[#555555] border border-[#0A0A0A]/10 hover:border-[#0A0A0A]/30'
                  }`}
                >
                  All{' '}
                  <span className={`ml-1 font-mono ${selectedCategory === 'All' ? 'text-white/70' : 'text-zinc-400'}`}>
                    ({allBlogs.length})
                  </span>
                </Link>
                {BLOG_CATEGORIES.map(cat => (
                  <Link
                    key={cat.slug}
                    to={categoryPath(cat.name)}
                    replace
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`text-xs px-4 py-2 transition-all duration-200 rounded-full font-medium whitespace-nowrap ${
                      selectedCategory === cat.name
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'bg-white text-[#555555] border border-[#0A0A0A]/10 hover:border-[#0A0A0A]/30'
                    }`}
                  >
                    {cat.name}{' '}
                    <span
                      className={`ml-1 font-mono ${
                        selectedCategory === cat.name ? 'text-white/70' : 'text-zinc-400'
                      }`}
                    >
                      ({categoryCounts[cat.name] ?? 0})
                    </span>
                  </Link>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Query titles, phrases, author..."
                  className="w-full bg-white border border-[#0A0A0A]/10 pl-10 pr-4 py-2.5 text-xs text-[#0A0A0A] placeholder-zinc-400 focus:outline-none focus:border-[#0066FF] rounded-full transition-colors"
                />
              </div>
            </section>

            {/* Blog grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map(blog => (
                <div
                  key={blog.id}
                  className="bg-white border border-zinc-200/85 p-6 md:p-8 rounded-3xl shadow-sm hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50 hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#0066FF] bg-[#0066FF]/5 px-2.5 py-0.5 rounded-full font-semibold">
                        {blog.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">{blog.readTime}</span>
                    </div>

                    <h3 className="text-xl font-display font-medium text-[#0A0A0A] leading-tight hover:text-[#0066FF] transition-colors cursor-pointer">
                      <PostLink post={blog} onOpen={setActiveBlogId} className="block w-full text-left">
                        {blog.title}
                      </PostLink>
                    </h3>

                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-3 font-sans">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A0A0A]/5 text-[#0066FF] flex items-center justify-center font-mono text-[10px] font-bold uppercase">
                        {blog.author.substring(0, 2)}
                      </div>
                      <div className="text-[11px]">
                        <span className="font-semibold text-zinc-900 block leading-none mb-0.5">
                          {blog.author}
                        </span>
                        <span className="text-zinc-400 text-[10px] font-mono">{blog.createdAt}</span>
                      </div>
                    </div>

                    <PostLink
                      post={blog}
                      onOpen={setActiveBlogId}
                      className="text-xs text-[#0a0a0a] hover:text-[#0066FF] font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Read speculate</span>
                      <span className="font-mono text-lg leading-none">→</span>
                    </PostLink>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {filteredBlogs.length === 0 && (
                <div className="col-span-1 md:col-span-2 border border-dashed border-zinc-200 p-16 text-center text-xs space-y-3 text-zinc-400 rounded-3xl bg-zinc-50/50">
                  <BookOpen className="w-8 h-8 mx-auto text-zinc-300" />
                  <p>No knowledge hub blog posts matched your query constraints.</p>
                  <button
                    onClick={() => {
                      handleCategorySelect('All');
                      setSearchQuery('');
                    }}
                    className="text-[#0066FF] hover:underline font-mono"
                  >
                    Reset parameters
                  </button>
                </div>
              )}
            </section>
          </motion.div>
        ) : (
          /* ==================== DETAIL VIEW ==================== */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="max-w-3xl mx-auto space-y-8 bg-white"
          >
            {routePost ? (
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors pb-2 border-b border-zinc-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to all insights</span>
              </Link>
            ) : (
              <button
                onClick={() => setActiveBlogId(null)}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors pb-2 border-b border-zinc-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to all insights</span>
              </button>
            )}

            {activeBlogDetail ? (
              <article className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#0066FF] bg-[#0066FF]/5 px-2.5 py-0.5 rounded-full font-semibold">
                      {activeBlogDetail.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeBlogDetail.readTime}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-[#0A0A0A] leading-tight tracking-tight">
                    {activeBlogDetail.title}
                  </h1>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-[#0066FF]/5 text-[#0066FF] flex items-center justify-center font-mono text-xs font-bold uppercase">
                      {activeBlogDetail.author.substring(0, 2)}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-[#0A0A0A] block">{activeBlogDetail.author}</span>
                      <span className="text-zinc-500 font-mono block mt-0.5">
                        Published // {activeBlogDetail.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-zinc max-w-none text-zinc-800 font-serif text-[15px] sm:text-[16px] leading-relaxed space-y-6 pt-6 border-t border-zinc-100">
                  {activeBlogDetail.content.split('\n\n').map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    if (trimmed.startsWith('###')) {
                      return (
                        <h3
                          key={index}
                          className="text-lg md:text-xl font-sans font-semibold text-zinc-900 tracking-tight pt-4"
                        >
                          {trimmed.slice(3).trim()}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('##')) {
                      return (
                        <h2
                          key={index}
                          className="text-xl md:text-2xl font-sans font-bold text-zinc-900 tracking-tight pt-5 border-b border-zinc-100 pb-2"
                        >
                          {trimmed.slice(2).trim()}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('#')) {
                      // The post title is already this page's <h1>
                      return (
                        <h2
                          key={index}
                          className="text-2xl md:text-3xl font-sans font-bold text-zinc-900 tracking-tight pt-5"
                        >
                          {trimmed.slice(1).trim()}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                      const items = trimmed.split('\n').map(li => li.replace(/^[*\-]\s*/, ''));
                      return (
                        <ul key={index} className="space-y-2.5 font-sans pl-5 list-disc text-sm text-zinc-700">
                          {items.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (trimmed.match(/^\d+\./)) {
                      const items = trimmed.split('\n').map(li => li.replace(/^\d+[.)]\s*/, ''));
                      return (
                        <ol key={index} className="space-y-2.5 font-sans pl-5 list-decimal text-sm text-zinc-700">
                          {items.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {item}
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
                  })}
                </div>
              </article>
            ) : (
              <div className="p-12 text-center text-zinc-400 text-xs font-mono">
                Requested speculate target database record not fetched.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== CREATE POST MODAL ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/45 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="bg-white border border-[#0A0A0A] p-6 md:p-8 max-w-2xl w-full relative text-[#0A0A0A] space-y-6 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-zinc-50 border border-transparent text-[#0A0A0A] rounded-full transition-colors"
                title="Dismiss form"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5">
                <span className="bg-[#0066FF]/5 text-[#0066FF] text-[8px] tracking-widest font-mono uppercase px-2 py-0.5 rounded font-semibold">
                  Cognitive Hub // Entry ingestion form
                </span>
                <h3 className="text-xl md:text-2xl font-sans font-semibold tracking-tight font-display">
                  Publish custom insights
                </h3>
                <p className="text-xs text-[#555555]">
                  Introduce local blog specs directly to test your content layout rendering locally on the client interface.
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateBlog} className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., Implementing Low Latency DB indexes inside compliant environments"
                    className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">
                      Author Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      placeholder="e.g., Devon Vance, Architect"
                      className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">
                      Post Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] bg-white rounded-xl text-xs"
                    >
                      {BLOG_CATEGORIES.map(cat => (
                        <option key={cat.slug} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">
                      Est. Read Time
                    </label>
                    <input
                      type="text"
                      value={newReadTime}
                      onChange={e => setNewReadTime(e.target.value)}
                      placeholder="e.g., 4 min read"
                      className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={newExcerpt}
                    onChange={e => setNewExcerpt(e.target.value)}
                    rows={2}
                    placeholder="A quick 1-2 sentence description summarizing the core insights of this post."
                    className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={6}
                    placeholder="Markdown syntax: Use ## for Headings, ### for sub-headers, lists, etc."
                    className="w-full border border-zinc-200 p-2.5 text-zinc-900 font-sans focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <button
                    type="submit"
                    className="bg-[#0066FF] text-white hover:bg-[#0055DD] text-xs font-semibold py-3 px-6 rounded-full transition-colors text-center shadow-sm"
                  >
                    Publish Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold py-3 px-6 rounded-full transition-colors text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
