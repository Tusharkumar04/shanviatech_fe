"use client";

import FrameImage from "@/components/ui/FrameImage";
import SplitHeading from "@/components/ui/SplitHeading";

interface WhyChooseUsProps {
  whyChoose?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
  } | null;
}

/**
 * Scene 05: a bone-coloured pause. Deliberately still: one large centred
 * statement and a single wide picture that opens from the left.
 */
export default function WhyChooseUs({ whyChoose }: WhyChooseUsProps) {
  if (!whyChoose) return null;

  return (
    <section className="section section--bone" aria-labelledby="why-title">
      <div className="wrap">
        <div className="intro-head" style={{ justifyItems: "center", textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span className="eyebrow__index">05</span>
            {whyChoose.title || "Why choose us"}
          </p>
          <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
            <span id="why-title">{whyChoose.subtitle}</span>
          </SplitHeading>
          {whyChoose.description ? (
            <p className="lede" style={{ maxWidth: "52ch", margin: "1rem auto 0", fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)" }}>
              {whyChoose.description}
            </p>
          ) : null}
        </div>
        <FrameImage src={whyChoose.image} alt={whyChoose.subtitle || whyChoose.title || "Why choose us"} aspect="cinema" direction="left" parallax={0.06} />
      </div>
    </section>
  );
}
