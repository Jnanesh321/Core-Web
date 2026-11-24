"use client";

import * as React from "react";

let lockCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

export function useScrollLock(active: boolean): void {
  React.useEffect(() => {
    if (!active) return;

    const body = document.body;

    if (lockCount === 0) {
      originalOverflow = body.style.overflow;
      originalPaddingRight = body.style.paddingRight;

      const scrollbarWidth = Math.max(
        0,
        window.innerWidth - document.documentElement.clientWidth,
      );
      const currentPadding = Number.parseFloat(
        window.getComputedStyle(body).paddingRight,
      );

      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [active]);
}
