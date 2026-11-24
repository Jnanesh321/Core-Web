import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoRE Web",
  description: "Center of Research and Excellence Platform, VCET Puttur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen bg-canvas text-text-high antialiased`}
      >
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
