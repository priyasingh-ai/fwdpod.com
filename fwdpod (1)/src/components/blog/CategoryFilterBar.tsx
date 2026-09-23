import { Link } from 'react-router-dom';
import { categoryPath } from '../../data/blogCategories';
import { INSIGHTS_PATH, type CategoryWithCount } from '../../data/blogCatalog';

interface CategoryFilterBarProps {
  /** Categories that have at least one post, in taxonomy order. */
  categories: CategoryWithCount[];
  /** Slug of the category being viewed; absent on the "All" listing. */
  activeSlug?: string;
  /** Post count behind the "All" chip. */
  totalCount: number;
}

/**
 * Category filter for the insights section.
 *
 * Every chip is a real link to a prerendered page, not a client-side toggle or
 * a ?query param, so each filtered view is its own crawlable, indexable URL.
 * The row scrolls sideways on narrow screens rather than wrapping into a block
 * that pushes the articles down.
 */
export default function CategoryFilterBar({
  categories,
  activeSlug,
  totalCount,
}: CategoryFilterBarProps) {
  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Filter insights by category"
      className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex items-center gap-2 w-max pb-1">
        <li>
          <FilterChip to={INSIGHTS_PATH} active={!activeSlug} label="All" count={totalCount} />
        </li>
        {categories.map(category => (
          <li key={category.slug}>
            <FilterChip
              to={categoryPath(category.slug)}
              active={activeSlug === category.slug}
              label={category.name}
              count={category.count}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FilterChip({
  to,
  active,
  label,
  count,
}: {
  to: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF] ${
        active
          ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
          : 'border-zinc-200 bg-white text-[#555555] hover:border-[#0066FF] hover:text-[#0A0A0A]'
      }`}
    >
      {label}
      <span
        className={`font-mono text-[10px] ${active ? 'text-white/60' : 'text-zinc-400'}`}
        aria-hidden="true"
      >
        {count}
      </span>
      <span className="sr-only">{count === 1 ? '1 article' : `${count} articles`}</span>
    </Link>
  );
}
