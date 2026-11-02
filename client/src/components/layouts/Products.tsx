
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/layouts/Loader";
import { getProductsApiCall } from "@/services/api/productsApi";

const PRODUCTS_PAGE_SIZE = 4;

interface Product {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    key_features?: string[];
    images?: string[];
    order?: number;
    image?: string;
    imageUrl?: string;
    livePreviewUrl?: string;
    supportTitle?: string;
    supportSub?: string;
}
interface ProductsResponse {
    code: number;
    message: string;
    data: {
        items: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");

    /*
     * Fetch products
     */
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                (await getProductsApiCall()) as ProductsResponse;

            console.log("products:", response);
            console.log("items:", response?.data?.items);

            // Your API response:
            // response.data.items
            const items = response?.data?.items || [];

            // Sort by order
            const sortedProducts = [...items].sort(
                (a, b) => (a.order ?? 0) - (b.order ?? 0)
            );

            setProducts(sortedProducts);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /*
     * Products currently visible
     */
    const displayedProducts = products.slice(
        0,
        page * PRODUCTS_PAGE_SIZE
    );

    const hasMoreItems =
        displayedProducts.length < products.length;

    /*
     * Load more
     */
    const loadMoreProducts = useCallback(() => {
        if (loadingMore || !hasMoreItems) return;

        setLoadingMore(true);

        setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
            setLoadingMore(false);
        }, 500);
    }, [hasMoreItems, loadingMore]);

    /*
     * Loading state
     */
    if (loading) {
        return (
            <section className="padding-100px-tb">
                <div className="container text-center">
                    <Loader size={30} inline />
                </div>
            </section>
        );
    }

    /*
     * Error state
     */
    if (error) {
        return (
            <section className="padding-100px-tb">
                <div className="container text-center">
                    <p className="text-red mb-4">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchProducts}
                        className="btn btn-medium btn-dark-gray btn-rounded"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Page Title */}
            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">
                                Products
                            </h1>
                        </div>

                        <div className="col-xl-4 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
                            <ul>
                                <li>
                                    <Link
                                        href="/"
                                        className="text-dark-gray"
                                    >
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <span className="text-dark-gray">
                                        Products
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="wow animate__fadeIn pt-5 pb-5">
                <div className="container">

                    {/* Heading */}
                    <div className="row justify-content-center">
                        <div className="col-12 col-xl-5 col-lg-6 col-md-7 col-sm-8 margin-eight-bottom md-margin-40px-bottom sm-margin-30px-bottom text-center">
                            <div className="alt-font text-dark-gray text-small-14 margin-5px-bottom text-uppercase">
                                Products
                            </div>

                            <h5 className="alt-font text-black font-weight-600 mb-0">
                                Discover our innovative solutions designed for you
                            </h5>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 blog-content">

                            {/* No Products */}
                            {products.length === 0 ? (
                                <div className="text-center padding-50px-tb">
                                    <p className="text-medium-gray mb-0">
                                        No products available.
                                    </p>
                                </div>
                            ) : (
                                <div className="product-list-wrapper">

                                    {displayedProducts.map(
                                        (item, index) => {
                                            const productHref =
                                                `/products/${item._id}`;

                                            const isEven =
                                                index % 2 === 0;

                                            /*
                                             * Currently your MongoDB product
                                             * does not contain an image.
                                             *
                                             * If image/imageUrl exists,
                                             * it will use that.
                                             */
                                            const productImage =
                                                item.images?.[0] ||
                                                item.image ||
                                                item.imageUrl ||
                                                `https://picsum.photos/seed/product-${item._id}/800/520`;

                                            return (
                                                <div
                                                    className="row align-items-center mb-5 pb-5 border-bottom product-border-light wow animate__fadeInUp"
                                                    key={item._id}
                                                >

                                                    {/* Image */}
                                                    <div
                                                        className={`col-lg-6 ${isEven
                                                            ? "order-1 order-lg-1"
                                                            : "order-1 order-lg-2"
                                                            }`}
                                                    >
                                                        <Link
                                                            href={productHref}
                                                            className="d-block overflow-hidden shadow-lg product-image-rounded position-relative"
                                                        >
                                                            <div className="blurBg" style={{ backgroundImage: `url(${productImage})` }}></div>
                                                            <Image
                                                                loader={({
                                                                    src,
                                                                }) => src}
                                                                unoptimized
                                                                src={
                                                                    productImage
                                                                }
                                                                alt={
                                                                    item.title
                                                                }
                                                                width={800}
                                                                height={520}
                                                                className="product-image-cover mx-auto"
                                                            />
                                                        </Link>
                                                    </div>

                                                    {/* Content */}
                                                    <div
                                                        className={`col-lg-6 ${isEven
                                                            ? "order-2 order-lg-2 ps-lg-5"
                                                            : "order-2 order-lg-1 pe-lg-5"
                                                            } mt-4 mt-lg-0`}
                                                    >

                                                        {/* Subtitle */}
                                                        {item.subtitle && (
                                                            <span className="text-medium-gray text-extra-medium text-uppercase d-block margin-15px-bottom font-weight-500 product-subtitle">
                                                                {
                                                                    item.subtitle
                                                                }
                                                            </span>
                                                        )}

                                                        {/* Title */}
                                                        <h3 className="alt-font text-extra-dark-gray font-weight-600 mb-3 product-title-heading">
                                                            <Link
                                                                href={
                                                                    productHref
                                                                }
                                                                className="text-extra-dark-gray"
                                                            >
                                                                {
                                                                    item.title
                                                                }
                                                            </Link>
                                                        </h3>

                                                        {/* Description */}
                                                        {item.description && (
                                                            <p className="mb-4 text-medium product-desc">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        )}

                                                        {/* Key Features */}
                                                        {item.key_features &&
                                                            item.key_features
                                                                .length >
                                                            0 && (
                                                                <ul className="mb-4 list-unstyled">
                                                                    {item.key_features.map(
                                                                        (
                                                                            feature,
                                                                            featureIndex
                                                                        ) => (
                                                                            <li
                                                                                key={featureIndex}
                                                                                className="mb-3 d-flex align-items-start text-medium"
                                                                            >
                                                                                <i
                                                                                    className="fas fa-check-circle mt-1 me-3 fs-5"
                                                                                    style={{
                                                                                        color: "#169d65",
                                                                                    }}
                                                                                ></i>
                                                                                {feature}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            )}

                                                        {/* View Details */}
                                                        <Link
                                                            href={productHref}
                                                            className="btn btn-medium btn-dark-gray btn-rounded d-inline-flex align-items-center product-btn"
                                                        >
                                                            View Details

                                                            <i className="fas fa-arrow-right ms-2"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}

                            {/* Load More */}
                            {hasMoreItems && (
                                <div className="row">
                                    <div className="col-12 text-center margin-40px-top sm-margin-30px-top">
                                        <button
                                            type="button"
                                            onClick={
                                                loadMoreProducts
                                            }
                                            disabled={
                                                loadingMore
                                            }
                                            className="btn btn-medium btn-dark-gray btn-rounded d-inline-flex align-items-center justify-content-center"
                                            style={{
                                                gap: 10,
                                            }}
                                        >
                                            {loadingMore ? (
                                                <>
                                                    <Loader
                                                        size={18}
                                                        inline
                                                    />
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
    );
}
