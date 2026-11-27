
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface CardGridSkeletonProps {
  count?: number;
  variant: "project" | "event" | "member" | "album";
  columns?: 1 | 2 | 3 | 4;
}

const columnStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

function CardSkeleton({
  variant,
}: {
  variant: CardGridSkeletonProps["variant"];
}) {
  if (variant === "member") {
    return (
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 shrink-0" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    );
  }

  if (variant === "event") {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="space-y-3 px-4 pb-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  if (variant === "album") {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <Skeleton className="aspect-video w-full" rounded="sm" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  // Project card: DESIGN.md specifies a 16:9 media preview.
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Skeleton className="aspect-video w-full" rounded="sm" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  variant,
  columns = 3,
}: CardGridSkeletonProps) {
  return (
    <div className={`grid gap-6 ${columnStyles[columns]}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-3" aria-hidden="true">
      <Skeleton className="h-8 w-1/2 max-w-sm" />
      <Skeleton className="h-4 w-3/4 max-w-xl" />
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <Skeleton className="aspect-video w-full max-w-4xl" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-5/6 max-w-2xl" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
