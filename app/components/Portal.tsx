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
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById("portal-root"));
  }, []);

  if (!target) return null;

  return createPortal(children, target);
}
