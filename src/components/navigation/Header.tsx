import Image from "next/image";
import Link from "next/link";

import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-[rgba(17,24,39,0.75)] backdrop-blur-[12px]">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="CoRE VCET home"
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/logo.svg"
            alt="CoRE logo"
            width={42}
            height={42}
            className="brightness-0 invert"
            priority
          />
          <span className="text-lg font-bold tracking-wide text-high">
            CoRE
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center">
          <Navbar />
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="primary" size="md">
            <Link href="/join">Join CoRE</Link>
          </Button>

          <Button asChild variant="ghost" size="md">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile navigation */}
        <MobileMenu />
      </div>
    </header>
  );
}
