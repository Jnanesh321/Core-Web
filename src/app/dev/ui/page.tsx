"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";

type ModalVariant = "center" | "sheet";

export default function UiDemoPage() {
  const [openVariant, setOpenVariant] = React.useState<ModalVariant | null>(
    null,
  );
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-12">
      <div>
        <h1 className="text-3xl font-bold text-text-high">UI components</h1>
        <p className="mt-2 text-text-muted">
          Modal dialog demos for centered and mobile sheet layouts.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setOpenVariant("center")}>
          Open centered modal
        </Button>
        <Button variant="secondary" onClick={() => setOpenVariant("sheet")}>
          Open sheet modal
        </Button>
      </div>

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
