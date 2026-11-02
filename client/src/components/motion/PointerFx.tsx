"use client";

import { useEffect } from "react";
import { startPointerFx } from "@/motion/pointer";

/** Mounts the spotlight layer for the whole app (desktop, motion allowed only). */
export default function PointerFx() {
  useEffect(() => startPointerFx(), []);
  return null;
}
