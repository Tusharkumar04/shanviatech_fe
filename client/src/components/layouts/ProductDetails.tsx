"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getProductsApiCall } from "@/services/api/productsApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/ui/Magnetic";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";
import { productImageOf, type Product } from "./Products";
import { externalProps, isExternalHref } from "@/utils/href";

interface ProductListResponse {
  data?: { items?: Product[] };
}

/**
 * Product detail. The product is looked up by _id from the list endpoint.
 * The gallery shows one large frame plus thumbnails; actions and support
 * copy come from the product itself.
 */
export default function ProductDetails({ slug }: { slug: string }) {
  const { data, loading, error, reload } = useApi<ProductListResponse>(
    () => getProductsApiCall() as Promise<ProductListResponse>,
    [slug],
    "Failed to load product details. Please try again.",
  );
  const product = useMemo(() => (data?.data?.items ?? []).find((item) => item?._id === slug) ?? null, [data, slug]);
  const gallery = useMemo(() => {
    if (!product) return [];
    const images = (product.images ?? []).filter(Boolean);
    if (images.length) return images;
    const single = productImageOf(product);
    return single ? [single] : [];
  }, [product]);
  const [active, setActive] = useState(0);

  if (loading) return <div className="wrap section"><LoadingState label="Loading product" /></div>;
  if (error) return <div className="wrap section"><ErrorState message={error} onRetry={reload} /></div>;
  if (!product) {
    return (
      <div className="wrap section">
        <EmptyState title="Product not found." action={{ href: "/products", label: "Back to products" }} />
      </div>
    );
  }

  const shot = gallery[active] ?? gallery[0];
  const preview = product.livePreviewUrl;

  return (
    <>
      <Opener crumbs={[{ label: "Products", href: "/products" }, { label: product.title }]} title={product.title} lede={product.subtitle} />

      <section className="section section--bone" aria-label="Product">
        <div className="wrap split">
          <div>
            <FrameImage src={shot} alt={product.title} aspect="wide" tilt />
            {gallery.length > 1 ? (
              <ul className="thumbs" aria-label="Gallery">
                {gallery.map((img, i) => (
                  <li key={`${img}-${i}`} style={{ listStyle: "none" }}>
                    <button
                      type="button"
                      className={`thumbs__btn ${i === active ? "is-active" : ""}`}
                      aria-label={`Show image ${i + 1}`}
                      aria-pressed={i === active}
                      onClick={() => setActive(i)}
                    >
                      <img src={img} alt="" loading="lazy" decoding="async" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            {product.description ? <p className="lede">{product.description}</p> : null}

            {product.key_features?.length ? (
              <div style={{ marginTop: "2rem" }}>
                <h2 className="note" style={{ margin: "0 0 1rem" }}>Key features</h2>
                <ul className="ticks">
                  {product.key_features.map((feature, i) => (
                    <li key={`${feature}-${i}`}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="cta-stack" style={{ marginTop: "2.5rem" }}>
              <Magnetic>
                <Link href="/reach-us" className="btn btn--signal" style={{ width: "100%", justifyContent: "center" }}>
                  Get a plan <Icon name="arrow" className="btn__arrow" />
                </Link>
              </Magnetic>
              {preview ? (
                <a
                  href={preview}
                  className="btn btn--ghost"
                  style={{ width: "100%", justifyContent: "center" }}
                  {...(isExternalHref(preview) ? externalProps(preview) : {})}
                >
                  Live preview <Icon name="external" />
                </a>
              ) : null}
            </div>

            {(product.supportTitle || product.supportSub) ? (
              <div className="support" style={{ marginTop: "2.5rem" }}>
                {product.supportTitle ? <h3 className="h4">{product.supportTitle}</h3> : null}
                {product.supportSub ? <p className="muted">{product.supportSub}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
