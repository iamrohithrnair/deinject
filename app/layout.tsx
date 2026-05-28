import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeInject — Context Isolation Firewall",
  description:
    "Segmented context-isolation firewall for web search against IPI and ad hijacking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
