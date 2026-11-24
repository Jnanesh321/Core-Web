"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "center" | "sheet";
  initialFocusRef?: React.RefObject<HTMLElement>;
  hideCloseButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
} as const;

const sheetSizeClasses = {
  sm: "max-w-none md:max-w-md",
  md: "max-w-none md:max-w-xl",
  lg: "max-w-none md:max-w-3xl",
} as const;

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  variant = "center",
  initialFocusRef,
  hideCloseButton = false,
  children,
  footer,
}: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    const appRoot = document.getElementById("app-root");
    if (!appRoot) return;

    const hadInert = appRoot.hasAttribute("inert");
    const previousAriaHidden = appRoot.getAttribute("aria-hidden");

    appRoot.setAttribute("inert", "");
    appRoot.setAttribute("aria-hidden", "true");

    return () => {
      if (!hadInert) appRoot.removeAttribute("inert");

      if (previousAriaHidden === null) {
        appRoot.removeAttribute("aria-hidden");
      } else {
        appRoot.setAttribute("aria-hidden", previousAriaHidden);
      }
    };
  }, [open]);

  useScrollLock(open);
  useFocusTrap(panelRef, open);

  React.useEffect(() => {
    const initialFocus = initialFocusRef?.current;
    if (open && initialFocus && panelRef.current?.contains(initialFocus)) {
      initialFocus.focus({ preventScroll: true });
    }
  }, [initialFocusRef, open]);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={[
        "modal-backdrop fixed inset-0 z-50 flex justify-center overflow-hidden bg-black/60",
        variant === "sheet"
          ? "items-end p-0 md:items-center md:p-4"
          : "items-center p-4",
      ].join(" ")}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={[
          "modal-panel relative flex max-h-[90vh] w-full flex-col overflow-y-auto",
          "rounded-xl border border-line bg-surface-1 shadow-2xl",
          variant === "sheet" ? sheetSizeClasses[size] : sizeClasses[size],
          variant === "sheet"
            ? "modal-sheet-panel rounded-t-2xl md:rounded-xl"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-text-high">
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="mt-1 text-sm text-text-muted"
              >
                {description}
              </p>
            )}
          </div>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/10 hover:text-text-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
