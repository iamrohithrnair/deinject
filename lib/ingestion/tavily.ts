import { tavily } from "@tavily/core";
import type { TavilyResult } from "@/lib/types";

let client: ReturnType<typeof tavily> | null = null;

function getClient() {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured");
  }
  if (!client) {
    client = tavily({ apiKey });
  }
  return client;
}

export async function searchWeb(query: string): Promise<{ results: TavilyResult[] }> {
  const tvly = getClient();
  const searchResult = await tvly.search(query, {
    searchDepth: "advanced",
    maxResults: 3,
  });

  const results: TavilyResult[] = (searchResult.results ?? []).map((r) => ({
    url: r.url,
    title: r.title,
    content: r.content ?? "",
  }));

  return { results };
}
