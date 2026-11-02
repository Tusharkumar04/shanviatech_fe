/**
 * Custom cursor controller. It writes straight to the DOM (no React state), so
 * pointer movement never re-renders the tree. Elements declare their cursor
 * mode with data-cursor="view|drag|play|explore|link|button|read|menu" and an
 * optional data-cursor-label override.
 */
import { ensureGsap, gsap } from "./gsap";
import { DisposerBag, listen, noop, type Disposer } from "./cleanup";
import { hasFinePointer, prefersReducedMotion } from "./reducedMotion";

const DEFAULT_LABEL: Record<string, string> = {
  view: "View",
  drag: "Drag",
  play: "Play",
  explore: "Explore",
  read: "Read",
  menu: "Menu",
};

export function startCursor(root: HTMLElement): Disposer {
  if (typeof window === "undefined" || !hasFinePointer() || prefersReducedMotion()) return noop;
  ensureGsap();

  const bag = new DisposerBag();
  const dot = root.querySelector<HTMLElement>("[data-cursor-dot]");
  const ring = root.querySelector<HTMLElement>("[data-cursor-ring]");
  const label = root.querySelector<HTMLElement>("[data-cursor-label]");
  if (!dot || !ring || !label) return noop;

  document.documentElement.classList.add("has-custom-cursor");
  bag.add(() => document.documentElement.classList.remove("has-custom-cursor"));

  const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

  let visible = false;
  const show = () => {
    if (visible) return;
    visible = true;
    gsap.to(root, { autoAlpha: 1, duration: 0.3 });
  };
  const hide = () => {
    visible = false;
    gsap.to(root, { autoAlpha: 0, duration: 0.25 });
  };

  let mode = "";
  const setMode = (next: string, text?: string) => {
    if (next === mode) return;
    if (mode) root.classList.remove(`is-${mode}`);
    mode = next;
    if (next) root.classList.add(`is-${next}`);
    label.textContent = text ?? DEFAULT_LABEL[next] ?? "";
  };

  bag.add(
    listen(window, "pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      show();
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    }),
  );

  bag.add(listen(document, "pointerout", (event) => {
    if (!(event.relatedTarget as Node | null)) hide();
  }));

  bag.add(
    listen(document, "pointerover", (event) => {
      const target = (event.target as Element | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!target) {
        if (mode) setMode("");
        return;
      }
      setMode(target.dataset.cursor ?? "", target.dataset.cursorLabel);
    }),
  );

  bag.add(
    listen(document, "pointerdown", () => root.classList.add("is-down")),
  );
  bag.add(
    listen(document, "pointerup", () => root.classList.remove("is-down")),
  );

  return () => {
    bag.run();
    gsap.killTweensOf([root, dot, ring]);
  };
}
