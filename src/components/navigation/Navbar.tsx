"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./nav-links";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-high" : "text-body hover:text-high"
                }`}
              >
                {link.label}

                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-cyan" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
