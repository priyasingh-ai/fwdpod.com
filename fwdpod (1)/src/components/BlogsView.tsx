import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  User,
  Clock,
  ArrowLeft,
  X,
  Check,
  Filter
} from 'lucide-react';
import SEO, { SITE_BASE_URL } from './SEO';

function buildBlogListSchema(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_BASE_URL}/#blog`,
        'url': `${SITE_BASE_URL}/blog`,
        'name': 'AI Engineering Insights & LLM Development Blog | Fwdpod',
        'description': 'Deep-dives into LLM agent architectures, RAG systems, voice AI pipelines, enterprise compliance AI, and the economics of productised AI engineering teams.',
        'isPartOf': { '@id': `${SITE_BASE_URL}/#website` },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Insights', 'item': `${SITE_BASE_URL}/blog` }
          ]
        }
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_BASE_URL}/#blog-entity`,
        'name': 'Fwdpod Insights',
        'description': 'Technical articles on AI engineering, LLM development, RAG systems, and enterprise AI product delivery from the Fwdpod team.',
        'publisher': { '@id': `${SITE_BASE_URL}/#organization` },
        'blogPost': posts.map(post => ({
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.excerpt,
          'author': { '@type': 'Person', 'name': post.author },
          'datePublished': post.createdAt,
          'url': `${SITE_BASE_URL}/blog`,
          'keywords': post.category
        }))
      }
    ]
  };
}

function buildArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_BASE_URL}/#article-${post.id}`,
        'url': `${SITE_BASE_URL}/blog`,
        'name': `${post.title} | Fwdpod Insights`,
        'description': post.excerpt,
        'isPartOf': { '@id': `${SITE_BASE_URL}/#website` },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Insights', 'item': `${SITE_BASE_URL}/blog` },
            { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': `${SITE_BASE_URL}/blog` }
          ]
        }
      },
      {
        '@type': 'BlogPosting',
        '@id': `${SITE_BASE_URL}/#post-${post.id}`,
        'headline': post.title,
        'description': post.excerpt,
        'articleBody': post.content,
        'articleSection': post.category,
        'author': { '@type': 'Person', 'name': post.author },
        'publisher': { '@id': `${SITE_BASE_URL}/#organization` },
        'datePublished': post.createdAt,
        'url': `${SITE_BASE_URL}/blog`,
        'inLanguage': 'en-US',
        'keywords': `AI engineering, ${post.category.toLowerCase()}, LLM development, Fwdpod`
      }
    ]
  };
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Engineering' | 'Operations' | 'Compliance' | 'Strategy';
  author: string;
  readTime: string;
  createdAt: string;
}

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'scaling-ai-agents',
    title: 'Scaling Enterprise AI Agents: Beyond the Hello World Loop',
    category: 'Engineering',
    excerpt: 'Why standard single-turn LLM agent prompts fall apart in Production, and how state machine architectures like LangGraph or custom state loops provide the resiliency required by corporate SLAs.',
    author: 'Founder',
    readTime: '6 min read',
    createdAt: 'May 24, 2026',
    content: `Many enterprises start their generative AI journey by building simple single-turn chatbot assistants. These prototypes look amazing and perform well during sandbox presentations of "Hello World" scripts. However, when deployed into live transaction flows, these systems routinely crash under real-world multi-step execution.

### The Fragility of Simple Prompt Loops

In traditional software, execution is deterministic. Under chat prompts, inputs are unpredictable and raw LLM outputs vary. If a single prompt expects a structured JSON array but receives a markdown explanation, downstream database parses will failure.

To build production-grade agentic environments, teams must transition from single-prompt architectures to structured state-machine loops.

### Solving with State Machines

By leveraging unified state graphs (like LangGraph or custom event-driven loops), we can partition execution into rigid, isolated steps:

1. **Intake and Intent Mapping**: Classifying input query types prior to invoking expensive models.
2. **Deterministic Validation Hooks**: Parsing raw parameters through strict type-check functions before running models.
3. **Execution Sandboxing**: Running models in ephemeral container environments so malicious model commands cannot harm systems.
4. **Factual Grounding Checks**: Cross-referencing generated summaries against target documentation databases.

At Fwdpod, we assemble dedicated specialist teams to implement these exact robust guardrails, guaranteeing our clients enjoy standard, clean outcomes without hallucinations or service interruptions.`
  },
  {
    id: 'economics-of-pods',
    title: 'The Economics of Productised Autonomous Engineering Teams',
    category: 'Strategy',
    excerpt: 'How pre-assembled, cross-functional pods out-deliver fragmented software agencies and standard contractors by eliminating onboarding delays and coordination handoffs.',
    author: 'Founder',
    readTime: '4 min read',
    createdAt: 'May 22, 2026',
    content: `Traditional software development relies on hiring individual freelancers, contracting developers, or paying premium consulting rates to large agencies. In all three cases, organizations face immediate friction that delays system velocity.

### The Hidden Costs of Developer Sourcing

1. **Sourcing and Hiring Latency**: It takes 3-6 months to identify, interview, and sign competent AI engineers.
2. **Onboarding Context Loss**: Even brilliant developers require 4-6 weeks to learn specific corporate data models and legacy environment setups.
3. **Friction of Cohesion**: Throwing five strangers into a team results in weeks of coordination challenges, style misalignment, and tooling debates.

### Introducing the Autonomous Pod

A productised pod is a pre-formed operational unit. The engineers inside have already shipped multi-agent ecosystems together in previous engagements. They use standardized telemetry logs, aligned code styles, and tested deployment configurations.

When you instantiate a Fwdpod pod, you bypass onboarding overhead. The team starts writing production code from day one, delivered under a single simple outcomes contract.`
  },
  {
    id: 'low-latency-voice',
    title: 'Sub-150ms Conversational Voice: Overcoming Latency Bars',
    category: 'Operations',
    excerpt: 'Deep-dive into LiveKit pipelines, WebSocket gateways, and custom fine-tuning layers that power voice response agents with human-like reflex speeds.',
    author: 'Devon, Principal Architect',
    readTime: '8 min read',
    createdAt: 'May 18, 2026',
    content: `When a customer speaks to a voice agent on the phone, any response delay greater than 200 milliseconds creates an uncanny valley effect. The conversation stutters, speakers interrupt one another, and user confidence evaporates.

To achieve fluid, sub-150ms conversational reflex speeds, you cannot rely on standard HTTP REST API wrappers.

### The Latency Breakdown

A typical conversational AI voice loop consists of three distinct stages:

1. **Speech-to-Text (STT)**: Converting raw audio frames into strings.
2. **Language Model Processing (LLM)**: Prompt generation and output token generation.
3. **Text-to-Speech (TTS)**: Translating output strings back to streaming audio chunks.

If you trigger these sequentially over traditional HTTP routes, you accumulate latency from connection setups, standard buffering, and serialization.

### Implementing Direct Streaming

To bypass these bounds, our Voice AI pods implement permanent bi-directional WebSocket pipelines built over **LiveKit** or **WebRTC**:

* **Chunked Voice Activity Detection (VAD)**: Analyzing input channels locally so silencing is detected in under 50ms.
* **Token Streaming Pipes**: Rather than waiting for the entire LLM response sentence, generated tokens are streamed *immediately* into the TTS engine as they are generated.
* **Multi-Threaded Speech Synthesis**: Overlapping speech output generation while the model continues generating the tail end of the paragraph.

By streamlining the pipelines, we reduce human-to-agent delay to a whisper—enabling real-time voice routing for hospitals and banks.`
  },
  {
    id: 'compliance-isolation',
    title: 'PII Scrubbing and Safety in Air-Gapped Models',
    category: 'Compliance',
    excerpt: 'How to design zero-leak proxy gateways that anonymize real-time database transactions prior to model ingestion under strict SOC2 guidelines.',
    author: 'Sarah, Governance Principal',
    readTime: '5 min read',
    createdAt: 'May 15, 2026',
    content: `In highly regulated sectors like banking and healthcare, data leakage is a critical risk. If a medical support chatbot accidentally forwards a patient's Social Security Number or private diagnosis to a public consumer model API, it violates immediate HIPAA and SOC2 mandates.

How can security-conscious enterprises harness the power of frontier models while keeping private user profiles secure?

### The Air-Gapped Data Filter Proxy

The solution is placing a custom, hardened anonymization proxy between internal database schemas and external model environments.

Our Compliance AI pods design these proxies to operate on the following strict isolation protocols:

* **Real-time Named Entity Recognition (NER)**: Scanning incoming variables for phone numbers, email addresses, medical codes, and user names, instantly substituting them with temporary placeholder tags (e.g., \`[PATIENT_ID_A]\`).
* **Symmetric De-anonymization Mapping**: Keeping a secure, temporary, local look-up record of substituted tags inside memory. Once the external model returns the processed output, the proxy safely restores the real identity details prior to database save.
* **Local offline classification LLMs**: Running lightweight local security models (e.g., Llama-3-Guard) on private local servers to inspect all incoming prompts for prompt-injection attacks.

This ensures your core business secrets remain securely inside your cloud boundary while outbound requests are completely scrubbed.`
  }
];

export default function BlogsView() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Create Blog state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newExcerpt, setNewExcerpt] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Engineering' | 'Operations' | 'Compliance' | 'Strategy'>('Engineering');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newReadTime, setNewReadTime] = useState<string>('4 min read');
  
  // Validation errors
  const [formError, setFormError] = useState<string>('');

  // Active blog detail reading view (null means browsing the list)
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);

  // Load blogs from localStorage or seed defaults
  useEffect(() => {
    const cached = localStorage.getItem('FWDPOD_BLOGS');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as BlogPost[];
        // Sanitize any stale "Ayush, Founder" or "Ayush" references to just "Founder"
        const sanitized = parsed.map(b => {
          if (b.author && b.author.toLowerCase().includes('ayush')) {
            return { 
              ...b, 
              author: b.author.replace(/Ayush,\s*/gi, '').replace(/Ayush/gi, 'Founder') || 'Founder'
            };
          }
          return b;
        });
        setBlogs(sanitized);
        localStorage.setItem('FWDPOD_BLOGS', JSON.stringify(sanitized));
      } catch (e) {
        setBlogs(DEFAULT_BLOGS);
      }
    } else {
      setBlogs(DEFAULT_BLOGS);
      localStorage.setItem('FWDPOD_BLOGS', JSON.stringify(DEFAULT_BLOGS));
    }
  }, []);

  // Save to localStorage when changed
  const saveBlogs = (updatedBlogs: BlogPost[]) => {
    setBlogs(updatedBlogs);
    localStorage.setItem('FWDPOD_BLOGS', JSON.stringify(updatedBlogs));
  };

  // Filter posts
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      readTime: newReadTime ? newReadTime.trim() : '4 min read',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    const updated = [newBlog, ...blogs];
    saveBlogs(updated);

    // Clear form and close modal
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    setNewCategory('Engineering');
    setNewAuthor('');
    setNewReadTime('4 min read');
    setIsModalOpen(false);
  };

  const activeBlogDetail = blogs.find(b => b.id === activeBlogId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-12 text-[#0A0A0A]"
    >
      {/* Dynamic SEO — switches between blog list and article detail */}
      {activeBlogId && activeBlogDetail ? (
        <SEO
          title={`${activeBlogDetail.title} | Fwdpod Insights`}
          description={activeBlogDetail.excerpt}
          canonical="/blog"
          ogType="article"
          articlePublishedTime={activeBlogDetail.createdAt}
          jsonLd={buildArticleSchema(activeBlogDetail)}
        />
      ) : (
        <SEO
          title="AI Engineering Insights &amp; LLM Development Blog | Fwdpod"
          description="Deep-dives into LLM agent architectures, RAG systems, voice AI pipelines, enterprise compliance AI, and the economics of productised AI engineering teams."
          canonical="/blog"
          jsonLd={buildBlogListSchema(blogs)}
        />
      )}

      <AnimatePresence mode="wait">
        {!activeBlogId ? (
          /* ==================== LISTING VIEW ==================== */
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Header section */}
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

            {/* Filter and Search Bar Row */}
            <section className="bg-zinc-50 border border-[#0A0A0A]/10 p-4 rounded-3xl flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Category selector capsules */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {['All', 'Engineering', 'Operations', 'Compliance', 'Strategy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-4 py-2 transition-all duration-200 rounded-full font-medium ${
                      selectedCategory === cat
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'bg-white text-[#555555] border border-[#0A0A0A]/10 hover:border-[#0A0A0A]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Text Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query titles, phrases, author..."
                  className="w-full bg-white border border-[#0A0A0A]/10 pl-10 pr-4 py-2.5 text-xs text-[#0A0A0A] placeholder-zinc-400 focus:outline-none focus:border-[#0066FF] rounded-full transition-colors"
                />
              </div>
            </section>

            {/* Grid display list */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <div 
                  key={blog.id}
                  className="bg-white border border-zinc-200/85 p-6 md:p-8 rounded-3xl shadow-sm hover:border-[#0066FF] hover:border-1.5 hover:bg-zinc-50/50 hover:shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Top capsule category */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#0066FF] bg-[#0066FF]/5 px-2.5 py-0.5 rounded-full font-semibold">
                        {blog.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {blog.readTime}
                      </span>
                    </div>

                    {/* Blog Title */}
                    <h3 className="text-xl font-display font-medium text-[#0A0A0A] leading-tight hover:text-[#0066FF] transition-colors cursor-pointer" onClick={() => setActiveBlogId(blog.id)}>
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-3 font-sans">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Footer Card profile */}
                  <div className="pt-5 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A0A0A]/5 text-[#0066FF] flex items-center justify-center font-mono text-[10px] font-bold uppercase">
                        {blog.author.substring(0, 2)}
                      </div>
                      <div className="text-[11px]">
                        <span className="font-semibold text-zinc-900 block leading-none mb-0.5">{blog.author}</span>
                        <span className="text-zinc-400 text-[10px] font-mono">{blog.createdAt}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveBlogId(blog.id)}
                      className="text-xs text-[#0a0a0a] hover:text-[#0066FF] font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Read speculate</span>
                      <span className="font-mono text-lg leading-none">→</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredBlogs.length === 0 && (
                <div className="col-span-1 md:col-span-2 border border-dashed border-zinc-200 p-16 text-center text-xs space-y-3 text-zinc-400 rounded-3xl bg-zinc-50/50">
                  <BookOpen className="w-8 h-8 mx-auto text-zinc-300" />
                  <p>No knowledge hub blog posts matched your query constraints.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
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
          /* ==================== DETAIL READING VIEW ==================== */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="max-w-3xl mx-auto space-y-8 bg-white"
          >
            {/* Back button link */}
            <button
              onClick={() => setActiveBlogId(null)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors pb-2 border-b border-zinc-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all insights</span>
            </button>

            {/* Main Blog Core Article */}
            {activeBlogDetail ? (
              <article className="space-y-8">
                {/* Meta block */}
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

                  {/* Author card list */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-[#0066FF]/5 text-[#0066FF] flex items-center justify-center font-mono text-xs font-bold uppercase">
                      {activeBlogDetail.author.substring(0, 2)}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-[#0A0A0A] block">{activeBlogDetail.author}</span>
                      <span className="text-zinc-500 font-mono block mt-0.5">Published // {activeBlogDetail.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Main Body text rendered properly */}
                <div className="prose prose-zinc max-w-none text-zinc-800 font-serif text-[15px] sm:text-[16px] leading-relaxed space-y-6 pt-6 border-t border-zinc-100">
                  {activeBlogDetail.content.split('\n\n').map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    if (trimmed.startsWith('###')) {
                      return (
                        <h3 key={index} className="text-lg md:text-xl font-sans font-semibold text-zinc-900 tracking-tight pt-4">
                          {trimmed.slice(3).trim()}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('##')) {
                      return (
                        <h2 key={index} className="text-xl md:text-2xl font-sans font-bold text-zinc-900 tracking-tight pt-5 border-b border-zinc-100 pb-2">
                          {trimmed.slice(2).trim()}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                      const listItems = trimmed.split('\n').map(li => li.replace(/^[\*\-]\s*/, ''));
                      return (
                        <ul key={index} className="space-y-2.5 font-sans pl-5 list-disc text-sm text-zinc-700">
                          {listItems.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (trimmed.match(/^\d+\./)) {
                      const listItems = trimmed.split('\n').map(li => li.replace(/^\d+[\.\)]\s*/, ''));
                      return (
                        <ol key={index} className="space-y-2.5 font-sans pl-5 list-decimal text-sm text-zinc-700">
                          {listItems.map((item, idx) => (
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

      {/* ==================== CREATE POST MODAL DIALOG ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/45 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="bg-white border border-[#0A0A0A] p-6 md:p-8 max-w-2xl w-full relative text-[#0A0A0A] space-y-6 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button top-right */}
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
                  <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateBlog} className="space-y-4 font-sans text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">Post Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Implementing Low Latency DB indexes inside compliant environments"
                    className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] rounded-xl text-xs"
                  />
                </div>

                {/* Two-column Author & ReadTime/Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">Author Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g., Devon Vance, Architect"
                      className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">Post Category <span className="text-red-500">*</span></label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] bg-white rounded-xl text-xs"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Operations">Operations</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Strategy">Strategy</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">Est. Read Time</label>
                    <input
                      type="text"
                      value={newReadTime}
                      onChange={(e) => setNewReadTime(e.target.value)}
                      placeholder="e.g., 4 min read"
                      className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">Excerpt <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    rows={2}
                    placeholder="A quick 1-2 sentence description summarizing the core insights of this post."
                    className="w-full border border-zinc-200 p-2.5 text-zinc-900 focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-[#555555] font-semibold">Content <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={6}
                    placeholder="Markdown syntax: Use ## for Headings, ### for sub-headers, lists, etc."
                    className="w-full border border-zinc-200 p-2.5 text-zinc-900 font-sans focus:outline-none focus:border-[#0066FF] rounded-xl text-xs"
                  />
                </div>

                {/* Actions button */}
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
