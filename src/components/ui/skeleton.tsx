import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedStyles = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ rounded = "md", className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={[
          "relative overflow-hidden bg-elevated",
          "before:absolute before:inset-0",
          "before:-translate-x-full",
          "before:animate-shimmer",
          "before:bg-gradient-to-r",
          "before:from-transparent",
          "before:via-white/10",
          "before:to-transparent",
          roundedStyles[rounded],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
