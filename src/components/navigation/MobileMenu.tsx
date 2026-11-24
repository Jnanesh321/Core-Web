"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { navLinks } from "./nav-links";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(menuRef, isOpen);
  useScrollLock(isOpen);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close the drawer when Escape is pressed.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-high transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="fixed inset-0 z-50 flex min-h-screen flex-col bg-canvas px-6 pb-8 pt-20"
        >
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-high hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            >
              <X size={24} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={`flex min-h-12 items-center border-b border-line text-lg font-medium ${
                        isActive ? "text-high" : "text-body hover:text-high"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
