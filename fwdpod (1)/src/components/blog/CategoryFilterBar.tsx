import { Link } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import { categoryPath } from '../../data/blogCategories';
import { INSIGHTS_PATH, type CategoryWithCount } from '../../data/blogCatalog';

interface CategoryFilterBarProps {
  /** All categories, in taxonomy order; empty ones render dimmed. */
  categories: CategoryWithCount[];
  /** Slug of the category being viewed; absent on the "All" listing. */
  activeSlug?: string;
  /** Post count behind the "All categories" option. */
  totalCount: number;
}

/**
 * Category picker for the insights section: a search-style field that opens
 * the five categories with their post counts, sitting beside the page heading.
 *
 * Built on <details> rather than a <select> or a JS menu for two reasons. The
 * options are real links to prerendered category pages, so each filtered view
 * stays a crawlable URL and every option is in the served HTML whether the
 * panel is open or shut. And it works with the keyboard, and without
 * JavaScript, on its own.
 */
export default function CategoryFilterBar({
  categories,
  activeSlug,
  totalCount,
}: CategoryFilterBarProps) {
  if (categories.length === 0) return null;

  const active = categories.find(category => category.slug === activeSlug);
  const label = active ? active.name : 'All categories';
  const count = active ? active.count : totalCount;

  return (
    <details className="group relative w-full md:w-[22rem]">
      <summary
        aria-label="Filter insights by category"
        className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 shadow-sm transition-colors hover:border-[#0066FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF] [&::-webkit-details-marker]:hidden"
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="flex-1 truncate text-xs font-semibold text-[#0A0A0A]">{label}</span>
        <span className="font-mono text-[10px] text-zinc-400" aria-hidden="true">
          {count}
        </span>
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-lg">
        <ul>
          <li>
            <PickerOption
              to={INSIGHTS_PATH}
              active={!activeSlug}
              label="All categories"
              count={totalCount}
            />
          </li>
          {/* key sits on the <li>: @types/react is not installed, so JSX types
              here do not accept key on a custom component. */}
          {categories.map(category => (
            <li key={category.slug}>
              <PickerOption
                to={categoryPath(category.slug)}
                active={activeSlug === category.slug}
                label={category.name}
                count={category.count}
                empty={category.count === 0}
              />
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function PickerOption({
  to,
  active,
  label,
  count,
  empty = false,
}: {
  to: string;
  active: boolean;
  label: string;
  count: number;
  empty?: boolean;
}) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0066FF] ${
        active
          ? 'bg-[#0A0A0A] font-semibold text-white'
          : empty
            ? 'text-zinc-400 hover:bg-zinc-50'
            : 'font-semibold text-[#555555] hover:bg-zinc-50 hover:text-[#0A0A0A]'
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`font-mono text-[10px] ${active ? 'text-white/60' : 'text-zinc-400'}`}
        aria-hidden="true"
      >
        {count}
      </span>
      <span className="sr-only">
        {count === 0 ? 'no articles yet' : count === 1 ? '1 article' : `${count} articles`}
      </span>
    </Link>
  );
}
