'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BlogItem,
  getBlogBySlugApiCall,
} from "@/services/api/blogApi";
import { useDateFormatter } from "@/hooks/useDateFormatter";

interface BlogDetailsProps {
  slug: string;
  initialBlog?: BlogItem | null;
}

export default function BlogDetails({ slug, initialBlog = null }: BlogDetailsProps) {
  const [blog, setBlog] = useState<BlogItem | null>(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [error, setError] = useState<string | null>(null);
  const { formatDate } = useDateFormatter();

  useEffect(() => {
    if (initialBlog) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await getBlogBySlugApiCall(slug);
        setBlog(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load blog details";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, initialBlog]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!blog) return <div>Blog not found.</div>;

  return (
    <>
      <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-md-6 text-center text-md-start">
              <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">
                Blog - Details
              </h1>
            </div>
            <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
              <ul>
                <li>
                  <Link href="/" className="text-dark-gray">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-dark-gray">
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="wow animate__fadeIn">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              {blog?.image ? (
                <div className="margin-30px-bottom">
                  <Image
                    loader={({ src }) => src}
                    unoptimized
                    src={blog.image}
                    alt={blog?.title || "Blog image"}
                    width={1200}
                    height={720}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ) : null}

              <div className="text-medium-gray text-uppercase text-extra-small margin-20px-bottom">
                by {blog?.author?.name || "Unknown"} | {formatDate(blog?.updatedAt)}
              </div>
              <h5 className="alt-font text-black font-weight-600 mb-4">{blog?.title}</h5>
              <div className="detailsBlg with-check-list" dangerouslySetInnerHTML={{ __html: (blog?.description || blog?.short_description || "") as string }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
