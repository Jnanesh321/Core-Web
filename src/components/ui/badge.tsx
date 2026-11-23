import * as React from "react";

export type BadgeVariant =
  | "neutral"
  | "info"
  | "violet"
  | "success"
  | "warning"
  | "danger";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-[#1F2937] text-[#F9FAFB]",

  info: "bg-[#06B6D4]/10 text-[#F9FAFB]",

  violet: "bg-[#8B5CF6]/10 text-[#F9FAFB]",

  success: "bg-[#10B981]/10 text-[#F9FAFB]",

  warning: "bg-[#F59E0B]/10 text-[#F9FAFB]",

  danger: "bg-[#EF4444]/10 text-[#F9FAFB]",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "neutral", icon, className = "", children, ...props }, ref) => {
    const combinedClassName = [
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
      "text-[13px] font-medium leading-5",
      variants[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {icon && (
          <span
            className="inline-flex h-3.5 w-3.5 items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
