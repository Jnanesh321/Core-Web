"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-brand-cyan to-brand-blue text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-blue/20",

  secondary:
    "border border-border-strong bg-transparent text-text-high hover:bg-white/5",

  ghost:
    "border border-border-strong bg-transparent text-text-body hover:bg-white/5 hover:text-text-high",

  danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled = false,
      className = "",
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const combinedClassName = [
      baseStyles,
      variants[variant],
      sizes[size],
      isDisabled ? "pointer-events-none opacity-50" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}

        <Slottable>{children}</Slottable>

        {!loading && rightIcon}
      </>
    );

    if (asChild) {
      return (
        <Slot
          className={combinedClassName}
          aria-disabled={isDisabled}
          aria-busy={loading}
          onClick={(event) => {
            if (isDisabled) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
          }}
          {...props}
        >
          {content}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={isDisabled}
        aria-busy={loading}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";
