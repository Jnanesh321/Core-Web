"use client";

import * as React from "react";
import { AlertCircle, Check, Inbox, Search, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/skeleton";

type ModalVariant = "center" | "sheet";

export default function UiDemoPage() {
  const [openVariant, setOpenVariant] = React.useState<ModalVariant | null>(
    null,
  );
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-3xl font-bold text-text-high">UI components</h1>
        <p className="mt-2 text-text-muted">
          A gallery of the reusable components currently available in the
          project.
        </p>
      </div>

      <section id="buttons" className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-high">Buttons</h2>
          <p className="mt-1 text-sm text-text-muted">
            Variants, sizes, icons, and loading state.
          </p>
        </div>
        <div className="space-y-5 rounded-xl border border-line bg-surface-1 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button leftIcon={<Check size={16} aria-hidden="true" />}>
              With icon
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-high">Badges</h2>
          <p className="mt-1 text-sm text-text-muted">
            Status and category labels in each supported color.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 rounded-xl border border-line bg-surface-1 p-5">
          <Badge>Neutral</Badge>
          <Badge variant="info" icon={<AlertCircle size={14} />}>
            Info
          </Badge>
          <Badge variant="violet">Violet</Badge>
          <Badge variant="success" icon={<Check size={14} />}>
            Success
          </Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-high">
            Form controls
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Input, textarea, select, and form field states.
          </p>
        </div>
        <div className="grid gap-5 rounded-xl border border-line bg-surface-1 p-5 md:grid-cols-2">
          <FormField
            label="Search"
            htmlFor="demo-search"
            hint="Search by name or email address."
          >
            <Input
              id="demo-search"
              placeholder="Search people..."
              leftIcon={<Search size={16} />}
            />
          </FormField>
          <FormField label="Name" htmlFor="demo-name" required>
            <Input
              id="demo-name"
              placeholder="Your name"
              leftIcon={<UserRound size={16} />}
              required
            />
          </FormField>
          <FormField
            label="Email"
            htmlFor="demo-email"
            error="Enter a valid email address."
          >
            <Input
              id="demo-email"
              type="email"
              placeholder="you@example.com"
              invalid
            />
          </FormField>
          <FormField label="Role" htmlFor="demo-role">
            <Select id="demo-role" defaultValue="">
              <option value="" disabled>
                Select a role
              </option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </Select>
          </FormField>
          <FormField
            label="About"
            htmlFor="demo-about"
            hint="Share a short introduction."
          >
            <Textarea
              id="demo-about"
              placeholder="Write a few words..."
              className="md:min-h-[120px]"
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-high">Empty state</h2>
          <p className="mt-1 text-sm text-text-muted">
            A helpful placeholder for when a view has no content.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface-1">
          <EmptyState
            icon={Inbox}
            title="No messages yet"
            description="When you receive a message, it will show up here."
            action={{ label: "Explore components", href: "#buttons" }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-high">Skeletons</h2>
          <p className="mt-1 text-sm text-text-muted">
            Loading placeholders with configurable shape.
          </p>
        </div>
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface-1 p-5 sm:flex-row">
          <div className="flex flex-1 items-center gap-4">
            <Skeleton className="h-12 w-12 shrink-0" rounded="full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" rounded="sm" />
              <Skeleton className="h-3 w-2/3" rounded="sm" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="h-24 w-full" rounded="lg" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-24" rounded="md" />
              <Skeleton className="h-9 w-24" rounded="md" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-high">Modal</h2>
          <p className="mt-1 text-sm text-text-muted">
            Centered dialog and responsive mobile sheet variants.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 rounded-xl border border-line bg-surface-1 p-5">
          <Button onClick={() => setOpenVariant("center")}>
            Open centered modal
          </Button>
          <Button variant="secondary" onClick={() => setOpenVariant("sheet")}>
            Open sheet modal
          </Button>
        </div>
      </section>

      <Modal
        open={openVariant !== null}
        onClose={() => setOpenVariant(null)}
        title="Join the CoRE community"
        description="Enter your details to start your registration."
        variant={openVariant ?? "center"}
        initialFocusRef={nameInputRef}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpenVariant(null)}>
              Cancel
            </Button>
            <Button type="submit" form="registration-form">
              Continue
            </Button>
          </>
        }
      >
        <form
          id="registration-form"
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setOpenVariant(null);
          }}
        >
          <FormField label="Full name" htmlFor="full-name" required>
            <Input
              ref={nameInputRef}
              id="full-name"
              name="name"
              autoComplete="name"
              required
            />
          </FormField>
          <FormField label="Email address" htmlFor="email-address" required>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </FormField>
        </form>
      </Modal>
    </main>
  );
}
