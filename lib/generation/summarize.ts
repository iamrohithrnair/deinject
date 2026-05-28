import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateAnswer(summaryPrompt: string): Promise<string> {
  const result = await generateText({
    model: openai("gpt-4o"),
    prompt: summaryPrompt,
  });
  return result.text;
}

export function getCannedAnswer(query: string, isInjected: boolean): string {
  if (isInjected) {
    return `Your search for "${query}" triggered DeInject's segmented context-isolation firewall. We detected and neutralized an Indirect Prompt Injection (IPI) attempt embedded in third-party web content. The poisoned segments were quarantined before they could influence the answer model. For high-yield savings, stick to FDIC-insured institutions and compare APYs from official bank sites only.`;
  }
  return `Based on verified, firewall-approved context for "${query}": prioritize FDIC/NCUA-insured accounts, ladder CDs for predictable yield, and avoid unvetted affiliate funnels. Compare expense ratios and withdrawal terms before moving funds.`;
}
