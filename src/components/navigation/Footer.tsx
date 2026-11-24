import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { navLinks } from "./nav-links";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="CoRE VCET home"
              className="mb-4 inline-flex items-center gap-2"
            >
              <Image
                src="/logo.svg"
                alt="CoRE logo"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <span className="text-xl font-bold text-high">CoRE</span>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-body">
              Center of Research and Excellence, Vivekananda College of
              Engineering and Technology, Puttur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-high">
              Quick Links
            </h2>

            <ul className="grid grid-cols-2 gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-body transition-colors hover:text-brand-cyan"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location and Social */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-high">
              Find Us
            </h2>

            <p className="flex items-start gap-2 text-sm leading-6 text-body">
              <MapPin
                size={18}
                className="mt-1 shrink-0 text-brand-cyan"
                aria-hidden="true"
              />
              Vivekananda College of Engineering and Technology, Puttur,
              Karnataka, India.
            </p>

            <h3 className="mb-3 mt-6 text-sm font-semibold text-high">
              Connect With Us
            </h3>

            <div className="flex items-center gap-3">
              <span className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-line px-3 text-sm text-body">
                GitHub
              </span>

              <span className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-line px-3 text-sm text-body">
                Instagram
              </span>

              <span className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-line px-3 text-sm text-body">
                LinkedIn
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-center">
          <p className="text-xs text-muted">
            © {currentYear} CoRE VCET. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
