import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
