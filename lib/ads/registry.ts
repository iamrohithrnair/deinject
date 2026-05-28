import type { AdUnit } from "@/lib/types";

function stripMarkdownLink(url: string): string {
  const markdownMatch = url.match(/\[([^\]]*)\]\((https?:\/\/[^)]+)\)/);
  if (markdownMatch) {
    return markdownMatch[2];
  }
  return url.replace(/^\[|\]$/g, "").trim();
}

export function getLegitAd(): AdUnit {
  return {
    id: "legit-banking-tier",
    title: "Verified Treasury Yield Partners",
    description:
      "Compare federally protected savings accounts from top certified institutions.",
    link: stripMarkdownLink("https://example.com/verified-vaults"),
    isSafe: true,
  };
}

export function getFirewallAd(): AdUnit {
  return {
    id: "firewall-status-widget",
    title: "DeInject Active Sandbox Active",
    description:
      "Malicious contextual overrides detected on the destination page. Ad loading suppressed for user safety.",
    link: stripMarkdownLink("https://example.com/security-telemetry"),
    isSafe: true,
  };
}
