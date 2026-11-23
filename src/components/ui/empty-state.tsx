import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
        <Icon size={24} aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-text-high">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          <Button
            variant="secondary"
            onClick={action.onClick}
            asChild={Boolean(action.href)}
          >
            {action.href ? (
              <a href={action.href}>{action.label}</a>
            ) : (
              action.label
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
