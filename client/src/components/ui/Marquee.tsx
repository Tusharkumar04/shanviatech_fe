/**
 * Continuous horizontal ticker. Items are duplicated so the -50% loop is
 * seamless. Pauses on hover; disabled entirely under reduced motion via CSS.
 */
export default function Marquee({
  items,
  reverse = false,
  label,
}: {
  items: string[];
  reverse?: boolean;
  label?: string;
}) {
  if (!items.length) return null;
  const row = items.map((item, i) => (
    <span className="marquee__item" key={`${item}-${i}`}>
      {item}
    </span>
  ));

  return (
    <div className={`marquee ${reverse ? "marquee--reverse" : ""}`.trim()} role="region" aria-label={label ?? "Highlights"}>
      <div className="marquee__track">
        <div style={{ display: "flex" }}>{row}</div>
        <div style={{ display: "flex" }} aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}
