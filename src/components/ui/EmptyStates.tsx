
"use client";

import {
  CalendarDays,
  FolderGit2,
  Users,
  Trophy,
  Images,
  Search,
} from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export function NoUpcomingEvents({
  onBrowsePastEvents,
}: {
  onBrowsePastEvents?: () => void;
}) {
  return (
    <EmptyState
      icon={CalendarDays}
      title="No upcoming events"
      description="No upcoming events scheduled right now. Browse our past events or submit a project idea!"
      action={
        onBrowsePastEvents
          ? {
              label: "Browse past events",
              onClick: onBrowsePastEvents,
            }
          : undefined
      }
    />
  );
}

export function NoProjects({
  onExploreProjects,
}: {
  onExploreProjects?: () => void;
}) {
  return (
    <EmptyState
      icon={FolderGit2}
      title="No projects yet"
      description="There are no projects to display right now. Check back soon to discover what our community is building."
      action={
        onExploreProjects
          ? {
              label: "Explore projects",
              onClick: onExploreProjects,
            }
          : undefined
      }
    />
  );
}

export function NoPeople({
  onBrowseMembers,
}: {
  onBrowseMembers?: () => void;
}) {
  return (
    <EmptyState
      icon={Users}
      title="No people found"
      description="No community members match this view. Try changing your filters or browse all members."
      action={
        onBrowseMembers
          ? {
              label: "Browse members",
              onClick: onBrowseMembers,
            }
          : undefined
      }
    />
  );
}

export function NoAchievements({
  onViewAchievements,
}: {
  onViewAchievements?: () => void;
}) {
  return (
    <EmptyState
      icon={Trophy}
      title="No achievements yet"
      description="Achievements will appear here as community members reach new milestones."
      action={
        onViewAchievements
          ? {
              label: "View achievements",
              onClick: onViewAchievements,
            }
          : undefined
      }
    />
  );
}

export function NoPhotos({
  onViewGallery,
}: {
  onViewGallery?: () => void;
}) {
  return (
    <EmptyState
      icon={Images}
      title="No photos yet"
      description="There are no photos in this album yet. Check back after the next community event."
      action={
        onViewGallery
          ? {
              label: "View gallery",
              onClick: onViewGallery,
            }
          : undefined
      }
    />
  );
}

export function NoResults({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      title="No results"
      description="No matches. Try clearing a filter."
      action={{
        label: "Clear filters",
        onClick: onClear,
      }}
    />
  );
}
