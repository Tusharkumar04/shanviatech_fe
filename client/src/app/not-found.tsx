import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/ui/Magnetic";

export default function NotFound() {
  return (
    <section className="section section--ink not-found" aria-labelledby="not-found-title">
      <div className="wrap">
        <p className="eyebrow">
          <span className="eyebrow__index">404</span>
          Lost in the stack
        </p>
        <h1 id="not-found-title" className="display">
          This page <em>wandered off</em>.
        </h1>
        <p className="lede" style={{ marginTop: "2rem", maxWidth: "48ch" }}>
          The link may be old or mistyped. Try the home page, or browse what we do.
        </p>
        <div className="cta-row" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
          <Magnetic>
            <Link href="/" className="btn btn--signal">
              Go home <Icon name="arrow" className="btn__arrow" />
            </Link>
          </Magnetic>
          <Link href="/services" className="btn btn--ghost">
            Explore services
          </Link>
        </div>
      </div>
    </section>
  );
}
