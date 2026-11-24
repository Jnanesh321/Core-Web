import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CoRE Web",
    template: "%s | CoRE VCET",
  },
  description: "Center of Research and Excellence Platform, VCET Puttur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-canvas text-text-high antialiased`}
      >
        <div id="app-root" className="flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only z-[100] rounded-md bg-brand-cyan px-4 py-3 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Skip to main content
          </a>

          <Header />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
