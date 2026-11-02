/**
 * Single entry point for GSAP. Every animation in the app imports from here so
 * plugins are registered exactly once and only in the browser.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

let registered = false;

export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
