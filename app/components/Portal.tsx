"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Portal — renders children into #portal-root,
 * which lives OUTSIDE the scroll container in the dashboard layout.
 *
 * Use for: modals, overlays, context menus, tooltips, floating bars.
 */
export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.getElementById("portal-root")!);
}
