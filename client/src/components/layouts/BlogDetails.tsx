"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlogBySlugApiCall, type BlogItem } from "@/services/api/blogApi";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui/StatePanels";

interface BlogDetailsProps {
  slug: string;
  initialBlog?: BlogItem | null;
}

/** One article: opener with the title and meta, a cinematic image, then the body. */
export default function BlogDetails({ slug, initialBlog = null }: BlogDetailsProps) {
  const [blog, setBlog] = useState<BlogItem | null>(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const { formatDate } = useDateFormatter();

  useEffect(() => {
    if (initialBlog) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBlogBySlugApiCall(slug);
        if (!cancelled) setBlog(response);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load blog details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [slug, initialBlog, attempt]);

  if (loading) return <div className="wrap section"><LoadingState label="Loading article" /></div>;
  if (error) return <div className="wrap section"><ErrorState message={error} onRetry={() => setAttempt((n) => n + 1)} /></div>;
  if (!blog) {
    return (
      <div className="wrap section">
        <EmptyState title="Blog not found." action={{ href: "/blogs", label: "Back to all insights" }} />
      </div>
    );
  }

  const date = formatDate(blog.updatedAt);
  const author = blog.author?.name;

  return (
    <>
      <Opener
        crumbs={[{ label: "Insights", href: "/blogs" }, { label: blog.title || "Article" }]}
        title={blog.title || "Article"}
        lede={[date, author].filter(Boolean).join(" · ")}
      />

      {blog.image ? (
        <section className="band" aria-label="Cover image">
          <FrameImage src={blog.image} alt={blog.title || ""} aspect="cinema" parallax={0.12} className="band__media" />
        </section>
      ) : null}

      <section className="section section--bone" aria-label="Article">
        <article className="prose wrap">
          {blog.description || blog.short_description ? <div dangerouslySetInnerHTML={{ __html: (blog.description || blog.short_description || "") as string }} /> : null}
          <p style={{ marginTop: "3rem" }}>
            <Link href="/blogs" className="text-link">
              <Icon name="prev" /> All insights
            </Link>
          </p>
        </article>
      </section>
    </>
  );
}
