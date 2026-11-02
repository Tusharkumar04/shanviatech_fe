"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getProductsApiCall } from "@/services/api/productsApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import RevealGroup from "@/components/ui/RevealGroup";
import { EmptyState, ErrorState, LoadingState, SkeletonGrid } from "@/components/ui/StatePanels";

const PRODUCTS_PAGE_SIZE = 4;

export interface Product {
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
  data?: { items?: Product[] };
}

/** Product image, using the first gallery image, then the single image fields. */
export const productImageOf = (item: Product): string | undefined => item.images?.[0] || item.image || item.imageUrl || undefined;

/**
 * Product catalogue. Products are sorted by `order`, shown four at a time,
 * and each one links to its detail page by _id.
 */
export default function Products() {
  const { data, loading, error, reload } = useApi<ProductsResponse>(
    () => getProductsApiCall() as Promise<ProductsResponse>,
    [],
    "Failed to load products. Please try again.",
  );
  const [page, setPage] = useState(1);

  const products = useMemo(
    () => [...(data?.data?.items ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data],
  );
  const visible = products.slice(0, page * PRODUCTS_PAGE_SIZE);
  const hasMore = visible.length < products.length;

  return (
    <>
      <Opener crumbs={[{ label: "Products" }]} title="Products" lede="Ready-to-run software, built and maintained by our team." />

      <section className="section section--bone" aria-label="Product list">
        <div className="wrap">
          {loading ? (
            <div aria-busy="true">
              <LoadingState label="Loading products" />
              <SkeletonGrid count={4} />
            </div>
          ) : null}
          {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && products.length === 0 ? (
            <EmptyState title="No products published yet." text="Please check back soon." />
          ) : null}

          {!loading && !error && visible.length > 0 ? (
            <>
              <RevealGroup as="ul" className="product-list">
                {visible.map((item, index) => {
                  const href = `/products/${item._id}`;
                  const image = productImageOf(item);
                  return (
                    <li key={item._id || index} className={`product ${index % 2 ? "product--flip" : ""}`} data-reveal-item style={{ listStyle: "none" }}>
                      <div>
                        <Link href={href} className="product__media" data-cursor="view" data-cursor-label="Open" tabIndex={-1} aria-hidden="true">
                          <FrameImage src={image} alt="" aspect="wide" tilt />
                        </Link>
                      </div>
                      <div className="product__copy">
                        {item.subtitle ? <span className="note">{item.subtitle}</span> : null}
                        <h2 className="h2" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
                          <Link href={href} className="link-plain">{item.title}</Link>
                        </h2>
                        {item.description ? <p className="lede">{item.description}</p> : null}
                        {item.key_features?.length ? (
                          <ul className="ticks">
                            {item.key_features.map((feature, i) => (
                              <li key={`${feature}-${i}`}>{feature}</li>
                            ))}
                          </ul>
                        ) : null}
                        <Link href={href} className="btn">
                          View product <Icon name="arrow" className="btn__arrow" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </RevealGroup>

              {hasMore ? (
                <div className="center mt-l">
                  <button type="button" className="btn" onClick={() => setPage((p) => p + 1)}>
                    Load more <Icon name="arrow" className="btn__arrow" />
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
