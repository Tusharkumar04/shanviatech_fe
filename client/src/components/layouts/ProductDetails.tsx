"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/layouts/Loader";
import { getProductsApiCall } from "@/services/api/productsApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductDetailsProps {
    slug: string;
}

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

interface ProductListResponse {
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

export default function ProductDetails({
    slug,
}: ProductDetailsProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                (await getProductsApiCall()) as ProductListResponse;

            console.log("product list response:", response);

            const products = response?.data?.items || [];

            console.log("products:", products);
            console.log("requested product id:", slug);

            const foundProduct = products.find(
                (item) => item._id === slug
            );

            if (!foundProduct) {
                setError("Product not found.");
                return;
            }

            setProduct(foundProduct);
        } catch (err) {
            console.error("Failed to fetch product:", err);

            setError(
                "Failed to load product details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) {
        return (
            <Loader
                fullSection
                label="Loading Product Details..."
            />
        );
    }

    if (error || !product) {
        return (
            <section className="padding-100px-tb">
                <div className="container text-center">
                    <p className="text-medium-gray mb-4">
                        {error || "Product not found."}
                    </p>

                    <div className="d-flex justify-content-center gap-3">
                        <button
                            type="button"
                            onClick={fetchProduct}
                            className="btn btn-medium btn-dark-gray btn-rounded"
                        >
                            Try Again
                        </button>

                        <Link
                            href="/products"
                            className="btn btn-medium btn-light border btn-rounded"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    const fallbackImage =
        product.image ||
        product.imageUrl ||
        `https://picsum.photos/seed/product-${product._id}/800/520`;

    const productImages =
        product.images && product.images.length > 0
            ? product.images
            : [fallbackImage];

    return (
        <>
            {/* Page Title */}
            <section className="wow animate__fadeIn bg-light-gray padding-35px-tb page-title-small top-space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-7 col-md-6 text-center text-md-start">
                            <h1 className="alt-font text-extra-dark-gray font-weight-600 mb-0 text-uppercase">
                                {product.title}
                            </h1>
                        </div>

                        <div className="col-xl-5 col-md-6 breadcrumb justify-content-center justify-content-md-end text-small alt-font sm-margin-10px-top">
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
                                    <Link
                                        href="/products"
                                        className="text-dark-gray"
                                    >
                                        Products
                                    </Link>
                                </li>

                                <li>
                                    <span className="text-dark-gray">
                                        {product.title}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details */}
            <section className="wow animate__fadeIn pt-5 pb-5">
                <div className="container">
                    <div className="row">

                        {/* LEFT COLUMN */}
                        <div className="col-12 col-lg-8">

                            {/* Product Images */}
                            <div className="bg-light-gray mb-4">
                                <div className="product-details-slider product-slider-wrapper">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        navigation
                                        pagination={{
                                            clickable: true,
                                        }}
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        className="w-100"
                                    >
                                        {productImages.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="blurBg" style={{ backgroundImage: `url(${img})` }}></div>
                                                <Image
                                                    loader={({ src }) => src}
                                                    unoptimized
                                                    src={img}
                                                    alt={`${product.title} - Image ${index + 1}`}
                                                    width={800}
                                                    height={520}
                                                    className="product-slider-image"
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                {/* Live Preview */}
                                {product.livePreviewUrl && (
                                    <div className="text-center mb-3">
                                        <a
                                            href={
                                                product.livePreviewUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-medium btn-dark-gray btn-rounded d-inline-flex align-items-center product-btn"
                                        >
                                            Live Preview
                                            <i className="ri-share-box-line ms-2"></i>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Support Banner */}
                            {(product.supportTitle ||
                                product.supportSub) && (
                                    <div className="support-banner text-center text-white pt-4 pb-5 px-4 mb-4 product-support-banner">
                                        <h2 className="mb-4 font-weight-600 product-support-title">
                                            {product.supportTitle}
                                        </h2>

                                        {product.supportSub && (
                                            <div className="d-inline-block rounded px-4 py-2 product-support-highlight">
                                                <h3 className="mb-0 product-support-subtitle">
                                                    {
                                                        product.supportSub
                                                    }
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                )}

                            {/* Description */}
                            {product.description && (
                                <div className="product-description text-medium text-extra-dark-gray mb-5 product-description-text">
                                    <p>
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Key Features */}
                            {product.key_features &&
                                product.key_features.length > 0 && (
                                    <div className="product-features">
                                        <h6
                                            className="mb-4 border-bottom pb-3 font-weight-600 text-extra-dark-gray"
                                        >
                                            Key Features
                                        </h6>

                                        <ul className="row list-unstyled">
                                            {product.key_features.map(
                                                (
                                                    feature,
                                                    index
                                                ) => (
                                                    <li
                                                        key={index}
                                                        className="col-md-6 mb-4 text-medium d-flex align-items-start"
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
                                    </div>
                                )}
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="col-12 col-lg-4">

                            {/* Pricing Box */}
                            <div className="pricing-box bg-white border rounded padding-30px-all mb-4 shadow-sm">
                                <div className="border-bottom pb-3 mb-3">
                                    <h6 className="font-weight-600 m-0 text-extra-dark-gray">
                                        Regular License
                                    </h6>
                                </div>

                                <ul className="list-unstyled mb-4 text-small">
                                    <li className="mb-2">
                                        <i className="fas fa-check text-medium-gray me-2"></i>
                                        Quality checked
                                    </li>

                                    <li className="mb-2">
                                        <i className="fas fa-check text-medium-gray me-2"></i>
                                        Future updates
                                    </li>

                                    <li className="mb-2">
                                        <i className="fas fa-check text-medium-gray me-2"></i>
                                        Support included
                                    </li>

                                    {/* <li className="mb-2 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="me-2 product-license-checkbox"
                                        />
                                        Extend support to 12 months
                                    </li> */}
                                </ul>

                                {/* Quantity
                                <div className="quantity-selector mb-4">
                                    <label className="text-small font-weight-600 text-dark-gray d-block mb-2">
                                        Quantity
                                    </label>

                                    <div className="d-flex align-items-center">
                                        <button
                                            type="button"
                                            className="btn btn-light border p-0 d-flex justify-content-center align-items-center product-quantity-btn"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(
                                                        1,
                                                        quantity - 1
                                                    )
                                                )
                                            }
                                        >
                                            <i className="fas fa-minus text-small"></i>
                                        </button>

                                        <input
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="form-control text-center mx-2 product-quantity-input"
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-light border p-0 d-flex justify-content-center align-items-center product-quantity-btn"
                                            onClick={() =>
                                                setQuantity(
                                                    quantity + 1
                                                )
                                            }
                                        >
                                            <i className="fas fa-plus text-small"></i>
                                        </button>
                                    </div>
                                </div> */}

                                {/* Get Plan */}
                                <Link href={'/reach-us/'}>
                                    <button type="button" className="btn btn-large w-100 btn-dark-gray btn-rounded px-5 my-1 product-live-preview-btn">
                                        Get a Plan
                                    </button>
                                </Link>

                                <Link href={'/live-preview/'}>
                                    <button type="button" className="btn btn-large w-100 btn-transparent-dark-gray btn-rounded px-5 my-2 product-live-preview-btn-outline">
                                        Live Preview
                                    </button>
                                </Link>

                                {/* App Store Buttons */}
                                <div className="d-flex justify-content-between gap-2 mt-2">
                                    <Link href={'#'} className="w-50 text-decoration-none">
                                        <button type="button" className="btn btn-large w-100 btn-rounded text-white d-flex align-items-center justify-content-center app-store-btn">
                                            <i className="fab fa-google-play me-2 fs-5"></i> Play Store
                                        </button>
                                    </Link>
                                    <Link href={'#'} className="w-50 text-decoration-none">
                                        <button type="button" className="btn btn-large w-100 btn-rounded text-white d-flex align-items-center justify-content-center app-store-btn">
                                            <i className="fab fa-apple me-2 fs-5"></i> App Store
                                        </button>
                                    </Link>
                                </div>

                                <p className="text-center text-extra-small mt-3 mb-0 fst-italic text-medium-gray px-2 product-price-note">
                                    Price is in US dollars and excludes
                                    tax and handling fees
                                </p>
                            </div>

                            {/* Product Information */}
                            <div className="author-box bg-white border rounded padding-30px-all shadow-sm">
                                <div className="mb-3">
                                    <h6 className="font-weight-600 mb-2 text-extra-dark-gray">
                                        {product.title}
                                    </h6>

                                    {product.subtitle && (
                                        <p className="text-small text-medium-gray mb-0">
                                            {product.subtitle}
                                        </p>
                                    )}
                                </div>

                                <div className="d-flex align-items-center gap-3 mt-3">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="rounded-circle d-flex justify-content-center align-items-center author-badge">
                                            <i className="fab fa-php author-badge-icon"></i>
                                        </span>
                                        <span className="text-extra-small mt-1 text-medium-gray">PHP</span>
                                    </div>

                                    <div className="d-flex flex-column align-items-center">
                                        <span className="rounded-circle d-flex justify-content-center align-items-center author-badge">
                                            <i className="fab fa-html5 author-badge-icon"></i>
                                        </span>
                                        <span className="text-extra-small mt-1 text-medium-gray">HTML5</span>
                                    </div>

                                    <div className="d-flex flex-column align-items-center">
                                        <span className="rounded-circle d-flex justify-content-center align-items-center author-badge">
                                            <i className="fab fa-css3-alt author-badge-icon"></i>
                                        </span>
                                        <span className="text-extra-small mt-1 text-medium-gray">CSS3</span>
                                    </div>

                                    <div className="d-flex flex-column align-items-center">
                                        <span className="rounded-circle d-flex justify-content-center align-items-center author-badge">
                                            <i className="fab fa-js author-badge-icon"></i>
                                        </span>
                                        <span className="text-extra-small mt-1 text-medium-gray">JS</span>
                                    </div>

                                    <div className="d-flex flex-column align-items-center">
                                        <span className="rounded-circle d-flex justify-content-center align-items-center author-badge">
                                            <i className="fab fa-bootstrap author-badge-icon"></i>
                                        </span>
                                        <span className="text-extra-small mt-1 text-medium-gray">Bootstrap</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}