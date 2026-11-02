'use client';

import Link from "next/link";
import Image from "next/image";
import {
    BlogItem,
    getBlogApiCall,
} from "@/services/api/blogApi";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/layouts/Loader";

interface BlogsProps {
    limit?: number;
}

const BLOGS_PAGE_SIZE = 6;

export default function Blogs({ limit }: BlogsProps) {
    const pathname = usePathname()
    const [blogItems, setBlogItems] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreItems, setHasMoreItems] = useState(false);
    const { formatDate } = useDateFormatter();
    const isLoadMoreEnabled = typeof limit !== "number";
    const requestLimit = isLoadMoreEnabled ? BLOGS_PAGE_SIZE : limit;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBlogApiCall({ page: 1, limit: requestLimit });
                const items = response?.items ?? [];
                const totalPages = response?.meta?.totalPages ?? 1;

                setBlogItems(items);
                setPage(1);
                setHasMoreItems(isLoadMoreEnabled ? 1 < totalPages : false);
                setError(null);
            } catch (error) {
                console.error(error);
                setBlogItems([]);
                setHasMoreItems(false);
                setError(error instanceof Error ? error.message : "Unable to load blogs");
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchData();
    }, [isLoadMoreEnabled, requestLimit]);

    const loadMoreBlogs = useCallback(async () => {
        if (!isLoadMoreEnabled || loadingMore || !hasMoreItems) return;

        const nextPage = page + 1;
        setLoadingMore(true);

        try {
            const response = await getBlogApiCall({ page: nextPage, limit: requestLimit });
            const nextItems = response?.items ?? [];
            const totalPages = response?.meta?.totalPages ?? nextPage;

            setBlogItems((prevItems) => [...prevItems, ...nextItems]);
            setPage(nextPage);
            setHasMoreItems(nextPage < totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    }, [hasMoreItems, isLoadMoreEnabled, loadingMore, page, requestLimit]);

    if (loading) return <Loader fullSection label="Loading blogs" />;
    if (error) return <div>{error}</div>;
    if (!blogItems.length) return <div>No blogs found.</div>;

    return (
        <>
            {(pathname == '/blogs' || pathname == '/blogs/') && (
                <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-8 col-md-6 text-center text-md-start">
                                <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">Blogs</h1>
                            </div>
                            <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                                <ul>
                                    <li><Link href="/" className="text-dark-gray">Home</Link></li>
                                    <li><span className="text-dark-gray">Blogs</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}


            <section className="wow animate__fadeIn pt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xl-5 col-lg-6 col-md-7 col-sm-8 margin-eight-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center">
                            <div className="alt-font text-dark-gray text-small-14 margin-5px-bottom text-uppercase">Blogs</div>
                            <h5 className="alt-font text-black font-weight-600 mb-0">Publish what you think, dont put it on social media</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 blog-content">
                            <ul className="blog-grid blog-wrapper grid grid-3col xl-grid-3col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col hover-option4 blog-post-style3 gutter-extra-large" style={{display:"flex", flexDirection: "row", flexWrap: "wrap"}}>
                                {/* <li className="grid-sizer"></li> */}

                                {
                                    blogItems.map((item: BlogItem, index: number) => {
                                        const blogId = item?._id ?? item?.id;
                                        const blogSlug = item?.slug;
                                        const blogHref = blogSlug ? `/blogs/${blogSlug}` : "/blogs";
                                        const description = item?.short_description || item?.description || "";
                                        const excerpt =
                                            description.length > 100
                                                ? `${description.slice(0, 100)}...`
                                                : description;

                                        return (
                                            <li className="grid-item last-paragraph-no-margin text-center text-sm-start wow animate__fadeInUp" key={blogId || `${item?.title || "blog"}-${index}`}>
                                                <div className="blog-post bg-light-gray">
                                                    <div className="blog-post-images overflow-hidden position-relative">
                                                        <Link href={blogHref}>
                                                            {item?.image ? (
                                                                <Image
                                                                    loader={({ src }) => src}
                                                                    unoptimized
                                                                    src={item.image}
                                                                    alt={item?.title || "Blog image"}
                                                                    width={800}
                                                                    height={520}
                                                                    style={{ width: "100%", height: "190px", objectFit: "cover" }}
                                                                />
                                                            ) : null}
                                                            <div className="blog-hover-icon"><span className="text-extra-large font-weight-300">+</span></div>
                                                        </Link>
                                                    </div>
                                                    <div className="post-details padding-40px-all md-padding-20px-all">
                                                        <Link href={blogHref} className="alt-font post-title text-medium text-extra-dark-gray w-100 d-block lg-w-100 margin-15px-bottom">{item?.title}</Link>
                                                        <p dangerouslySetInnerHTML={{ __html: excerpt }}></p>
                                                        <div className="separator-line-horrizontal-full bg-medium-gray margin-20px-tb"></div>
                                                        <div className="author">
                                                            <span className="text-medium-gray text-uppercase text-small d-inline-block">by <Link href={blogHref} className="text-medium-gray">{item?.author?.name}</Link>&nbsp;&nbsp;|&nbsp;&nbsp;{formatDate(item?.updatedAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }


                            </ul>
                            {isLoadMoreEnabled && hasMoreItems && (
                                <div className="row">
                                    <div className="col-12 text-center margin-40px-top sm-margin-30px-top">
                                        <button
                                            type="button"
                                            onClick={loadMoreBlogs}
                                            disabled={loadingMore}
                                            className="btn btn-medium btn-dark-gray btn-rounded d-inline-flex align-items-center justify-content-center"
                                            style={{ gap: 10 }}
                                        >
                                            {loadingMore ? (
                                                <>
                                                    <Loader size={18} inline />
                                                    Loading...
                                                </>
                                            ) : (
                                                "Load More"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

