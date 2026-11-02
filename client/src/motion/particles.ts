/**
 * Canvas particle field for the hero. Points drift, connect when near each
 * other, and lean slightly toward the pointer. Runs only while on screen and
 * the tab is visible, caps device-pixel-ratio, and returns a full disposer.
 */
import { DisposerBag, listen, type Disposer } from "./cleanup";

export interface ParticleOptions {
  count: number;
  link: number;
  color: string;
  linkColor: string;
  pointer?: boolean;
  /** Draw one static frame and stop, used for reduced motion. */
  staticFrame?: boolean;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export function mountParticleField(canvas: HTMLCanvasElement, opts: ParticleOptions): Disposer {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;

  const bag = new DisposerBag();
  const pointer = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points: Point[] = [];
  let raf = 0;
  let onScreen = true;
  let pageVisible = !document.hidden;

  const seed = () => {
    points = Array.from({ length: opts.count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.6,
    }));
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
    if (opts.staticFrame) draw(false);
  };

  const draw = (advance: boolean) => {
    ctx.clearRect(0, 0, width, height);

    for (const p of points) {
      if (advance) {
        if (opts.pointer && pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22000) {
            p.vx += dx * 0.00004;
            p.vy += dy * 0.00004;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }
    }

    ctx.lineWidth = 1;
    const linkSq = opts.link * opts.link;
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkSq) {
          ctx.globalAlpha = (1 - d2 / linkSq) * 0.45;
          ctx.strokeStyle = opts.linkColor;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = opts.color;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const loop = () => {
    raf = 0;
    if (!onScreen || !pageVisible) return;
    draw(true);
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    if (opts.staticFrame || raf || !onScreen || !pageVisible) return;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  resize();
  if (!opts.staticFrame) start();

  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start();
    else stop();
  });
  observer.observe(canvas);
  bag.add(() => observer.disconnect());

  bag.add(
    listen(document, "visibilitychange", () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else stop();
    }),
  );
  bag.add(listen(window, "resize", resize));

  if (opts.pointer) {
    bag.add(
      listen(window, "pointermove", (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
      }),
    );
    bag.add(listen(window, "pointerleave", () => (pointer.active = false)));
  }

  return () => {
    stop();
    bag.run();
    ctx.clearRect(0, 0, width, height);
    canvas.width = 0;
    canvas.height = 0;
  };
}
