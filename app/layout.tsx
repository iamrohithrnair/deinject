import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeInject — Web Search Context Firewall",
  description:
    "Judge-ready demo: segmented context isolation against indirect prompt injection and ad hijacking in agentic web search.",
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
