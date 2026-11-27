
"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-text-high">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        {description}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
