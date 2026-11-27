
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Plus,
  X,
  Search,
  FolderOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Select, FormField } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

import {
  CardGridSkeleton,
  PageHeaderSkeleton,
  DetailPageSkeleton,
  ListSkeleton,
} from "@/components/ui/LoadingSkeleton";

import {
  NoUpcomingEvents,
  NoProjects,
  NoPeople,
  NoAchievements,
  NoPhotos,
  NoResults,
} from "@/components/ui/EmptyStates";

import { ErrorState } from "@/components/ui/ErrorState";

export default function UIShowcasePage() {
  const [demoMessage, setDemoMessage] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  return (
    <main className="min-h-screen space-y-12 bg-canvas p-8 text-text-high">
      <header>
        <h1 className="text-3xl font-bold">CoRE UI Components</h1>
        <p className="mt-2 text-text-muted">
          Preview of reusable UI primitives.
        </p>
      </header>

      {/* Button variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Variants</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      {/* Button sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Sizes</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Button states */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button States</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button leftIcon={<Plus size={16} />}>Add Project</Button>
          <Button rightIcon={<ArrowRight size={16} />}>
            Continue
          </Button>
        </div>
      </section>

      {/* Button as Link */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button as Link</h2>

        <Button asChild variant="secondary">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </section>

      {/* Badge variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badge Variants</h2>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="info">New</Badge>
          <Badge variant="violet">Featured</Badge>
          <Badge variant="success" icon={<Check size={14} />}>
            Approved
          </Badge>
          <Badge variant="warning" icon={<Clock size={14} />}>
            Pending
          </Badge>
          <Badge variant="danger" icon={<X size={14} />}>
            Rejected
          </Badge>
        </div>
      </section>

      {/* Input */}
      <section className="max-w-xl space-y-4">
        <h2 className="text-xl font-semibold">Input</h2>

        <Input placeholder="Enter your name" />

        <Input
          placeholder="Search projects..."
          leftIcon={<Search size={16} />}
        />

        <Input
          placeholder="Invalid input"
          invalid
          defaultValue="Invalid value"
        />
      </section>

      {/* FormField */}
      <section className="max-w-xl space-y-4">
        <h2 className="text-xl font-semibold">FormField</h2>

        <FormField
          label="Project Name"
          htmlFor="project-name"
          required
          hint="Enter a descriptive project name."
        >
          <Input id="project-name" placeholder="e.g. Campus Connect" />
        </FormField>

        <FormField
          label="Email Address"
          htmlFor="email"
          required
          error="Please enter a valid email address."
        >
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            invalid
          />
        </FormField>
      </section>

      {/* Textarea */}
      <section className="max-w-xl space-y-4">
        <h2 className="text-xl font-semibold">Textarea</h2>

        <Textarea placeholder="Describe your project..." rows={4} />
      </section>

      {/* Select */}
      <section className="max-w-xl space-y-4">
        <h2 className="text-xl font-semibold">Select</h2>

        <Select defaultValue="">
          <option value="" disabled>
            Select project category
          </option>
          <option value="web">Web Development</option>
          <option value="ai">Artificial Intelligence</option>
          <option value="mobile">Mobile Development</option>
        </Select>
      </section>

      {/* Existing Skeleton */}
      <section className="max-w-xl space-y-4">
        <h2 className="text-xl font-semibold">Skeleton</h2>

        <div className="space-y-3 rounded-xl border border-border-strong bg-surface p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12" rounded="full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>

          <Skeleton className="h-32 w-full" rounded="lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </section>

      {/* Card Grid Skeleton presets */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Card Grid Skeletons</h2>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Project Cards</h3>
          <div className="rounded-xl border border-border-strong bg-surface p-5">
            <CardGridSkeleton
              variant="project"
              count={3}
              columns={3}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Event Cards</h3>
          <div className="rounded-xl border border-border-strong bg-surface p-5">
            <CardGridSkeleton
              variant="event"
              count={3}
              columns={3}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Member Cards</h3>
          <div className="rounded-xl border border-border-strong bg-surface p-5">
            <CardGridSkeleton
              variant="member"
              count={3}
              columns={3}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Album Cards</h3>
          <div className="rounded-xl border border-border-strong bg-surface p-5">
            <CardGridSkeleton
              variant="album"
              count={3}
              columns={3}
            />
          </div>
        </div>
      </section>

      {/* Page Header Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Page Header Skeleton</h2>

        <div className="rounded-xl border border-border-strong bg-surface p-5">
          <PageHeaderSkeleton />
        </div>
      </section>

      {/* Detail Page Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Detail Page Skeleton</h2>

        <div className="rounded-xl border border-border-strong bg-surface p-5">
          <DetailPageSkeleton />
        </div>
      </section>

      {/* List Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">List Skeleton</h2>

        <div className="rounded-xl border border-border-strong bg-surface p-5">
          <ListSkeleton rows={4} />
        </div>
      </section>

      {/* Existing EmptyState */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">EmptyState</h2>

        <div className="rounded-xl border border-border-strong bg-surface">
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="You haven't created any projects. Start by exploring the CoRE platform."
            action={{
              label: "Explore CoRE",
              href: "/",
            }}
          />
        </div>
      </section>

      {/* Empty State Presets */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Empty State Presets</h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border-strong bg-surface">
            <NoUpcomingEvents
              onBrowsePastEvents={() =>
                setDemoMessage("Browse past events action clicked.")
              }
            />
          </div>

          <div className="rounded-xl border border-border-strong bg-surface">
            <NoProjects
              onExploreProjects={() =>
                setDemoMessage("Explore projects action clicked.")
              }
            />
          </div>

          <div className="rounded-xl border border-border-strong bg-surface">
            <NoPeople
              onBrowseMembers={() =>
                setDemoMessage("Browse members action clicked.")
              }
            />
          </div>

          <div className="rounded-xl border border-border-strong bg-surface">
            <NoAchievements
              onViewAchievements={() =>
                setDemoMessage("View achievements action clicked.")
              }
            />
          </div>

          <div className="rounded-xl border border-border-strong bg-surface">
            <NoPhotos
              onViewGallery={() =>
                setDemoMessage("View gallery action clicked.")
              }
            />
          </div>

          <div className="rounded-xl border border-border-strong bg-surface">
            <NoResults
              onClear={() => {
                setShowSearchResults(false);
                setDemoMessage("Filters cleared.");
              }}
            />
          </div>
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Error State</h2>

        <div className="rounded-xl border border-border-strong bg-surface">
          <ErrorState
            title="Unable to load projects"
            description="Something went wrong while loading projects. Please try again."
            onRetry={() => setDemoMessage("Retry action clicked.")}
          />
        </div>
      </section>

      {/* Action Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Preset Action Demo</h2>

        <div className="rounded-xl border border-border-strong bg-surface p-5">
          <Button
            variant="secondary"
            onClick={() => setShowSearchResults(true)}
          >
            Show search results state
          </Button>

          {showSearchResults && (
            <p className="mt-3 text-sm text-text-muted">
              Search results state is active. Use the NoResults Clear
              button above to reset it.
            </p>
          )}

          {demoMessage && (
            <p className="mt-3 text-sm text-text-muted" role="status">
              {demoMessage}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
