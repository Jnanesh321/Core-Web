import * as React from "react";
import { AlertCircle } from "lucide-react";

// --------------------------------------------------
// FormField
// --------------------------------------------------

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
}: FormFieldProps) {
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-text-high"
      >
        {label}

        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={hintId} className="text-sm text-text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-sm text-danger"
        >
          <AlertCircle size={15} aria-hidden="true" className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// --------------------------------------------------
// Input
// --------------------------------------------------

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      invalid = false,
      leftIcon,
      className = "",
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const inputId = id;
    const errorId = inputId ? `${inputId}-error` : undefined;

    const describedBy =
      [ariaDescribedBy, invalid ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={[
            "w-full min-h-[44px] rounded-lg border bg-surface px-3 py-2",
            "text-sm text-text-high placeholder:text-text-muted",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:border-brand-blue",
            "focus-visible:ring-[3px] focus-visible:ring-blue-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            invalid ? "border-danger" : "border-border-strong",
            leftIcon ? "pl-10" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

// --------------------------------------------------
// Textarea
// --------------------------------------------------

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      invalid = false,
      className = "",
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const errorId = id ? `${id}-error` : undefined;

    const describedBy =
      [ariaDescribedBy, invalid ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <textarea
        ref={ref}
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={[
          "w-full min-h-[100px] rounded-lg border bg-surface px-3 py-2",
          "text-sm text-text-high placeholder:text-text-muted",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:border-brand-blue",
          "focus-visible:ring-[3px] focus-visible:ring-blue-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y",
          invalid ? "border-danger" : "border-border-strong",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

// --------------------------------------------------
// Select
// --------------------------------------------------

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      invalid = false,
      className = "",
      id,
      "aria-describedby": ariaDescribedBy,
      children,
      ...props
    },
    ref,
  ) => {
    const errorId = id ? `${id}-error` : undefined;

    const describedBy =
      [ariaDescribedBy, invalid ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <select
        ref={ref}
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={[
          "w-full min-h-[44px] rounded-lg border bg-surface px-3 py-2",
          "text-sm text-text-high",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:border-brand-blue",
          "focus-visible:ring-[3px] focus-visible:ring-blue-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid ? "border-danger" : "border-border-strong",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
