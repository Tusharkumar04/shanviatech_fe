"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBlogApiCall, type BlogItem } from "@/services/api/blogApi";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import { EmptyState, ErrorState, LoadingState, SkeletonGrid } from "@/components/ui/StatePanels";

const PAGE_SIZE = 6;

interface BlogsProps {
  /** Fixed number of posts (home preview). Disables load more. */
  limit?: number;
  /** Show the section heading block. The /blogs page renders its own opener. */
  showHeading?: boolean;
}

/**
 * Insight list. Unlimited mode pages six at a time with load more; a numeric
 * `limit` shows a fixed preview with no paging, as before.
 */
export default function Blogs({ limit, showHeading = true }: BlogsProps) {
  const fixed = typeof limit === "number";
  const [items, setItems] = useState<BlogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const { formatDate } = useDateFormatter();
  const requestId = useRef(0);

  const fetchPage = useCallback(
    async (target: number, append: boolean) => {
      const id = ++requestId.current;
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError("");
      try {
        const data = await getBlogApiCall(fixed ? { limit } : { page: target, limit: PAGE_SIZE });
        if (id !== requestId.current) return;
        const next = (data?.items ?? []).filter(Boolean);
        setItems((prev) => (append ? [...prev, ...next] : next));
        setPage(data?.meta?.page ?? target);
        setTotalPages(data?.meta?.totalPages ?? 1);
      } catch (err) {
        if (id !== requestId.current) return;
        setError(err instanceof Error ? err.message : "Unable to load blogs.");
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [fixed, limit],
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const canLoadMore = !fixed && page < totalPages;

  return (
    <section className="section section--bone" aria-labelledby="blogs-title">
      <div className="wrap">
        {showHeading ? (
          <div className="intro-head intro-head--row">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__index">07</span>
                Insights
              </p>
              <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                <span id="blogs-title">Publish what you think</span>
              </SplitHeading>
            </div>
            {fixed ? (
              <Link href="/blogs" className="text-link" style={{ justifySelf: "end" }}>
                All insights <Icon name="arrow" />
              </Link>
            ) : null}
          </div>
        ) : null}

        {loading ? (
          <div aria-busy="true">
            <LoadingState label="Loading insights" />
            <SkeletonGrid count={fixed ? limit : 3} />
          </div>
        ) : null}

        {!loading && error ? <ErrorState message={error} onRetry={() => fetchPage(1, false)} /> : null}

        {!loading && !error && items.length === 0 ? (
          <EmptyState title="No blogs found." />
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <>
            <RevealGroup as="ul" className="grid grid--3 blog-grid">
              {items.map((item, index) => (
                <BlogCard key={item._id || item.id || `${item.title}-${index}`} item={item} formatDate={formatDate} />
              ))}
            </RevealGroup>

            {canLoadMore ? (
              <div className="center mt-l">
                <button
                  type="button"
                  className="btn"
                  onClick={() => fetchPage(page + 1, true)}
                  disabled={loadingMore}
                  aria-busy={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load more"} <Icon name="arrow" className="btn__arrow" />
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

function BlogCard({ item, formatDate }: { item: BlogItem; formatDate: (v: string | undefined) => string }) {
  const href = item.slug ? `/blogs/${item.slug}` : "/blogs";
  const description = item.short_description || item.description || "";
  const excerpt = description.length > 120 ? `${description.slice(0, 120).trim()}…` : description;
  const date = formatDate(item.updatedAt);
  const author = item.author?.name;

  return (
    <li className="card blog-card" data-reveal-item style={{ listStyle: "none" }}>
      <Link href={href} className="blog-card__link" data-cursor="view" data-cursor-label="Read">
        <FrameImage src={item.image} alt={item.title || "Blog image"} aspect="wide" tilt />
        <span className="mono muted" style={{ fontSize: "0.78rem", letterSpacing: "0.08em" }}>
          {[date, author].filter(Boolean).join(" · ")}
        </span>
        <span className="h4 blog-card__title">{item.title}</span>
        {excerpt ? <span className="muted" style={{ margin: 0 }}>{excerpt}</span> : null}
        <span className="text-link" aria-hidden="true">
          Read <Icon name="arrow" />
        </span>
      </Link>
    </li>
  );
}
