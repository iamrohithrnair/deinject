/**
 * Records DeInject judge demo frames via Playwright.
 * Usage: node scripts/record-demo.mjs [outputDir] [baseUrl]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const outDir =
  process.argv[2] ||
  path.join(process.cwd(), "demo", `frames-${Date.now()}`);
const baseUrl = process.argv[3] || "http://localhost:3000";

fs.mkdirSync(outDir, { recursive: true });

async function snap(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log("saved", file);
  return file;
}

async function clickPreset(page, label) {
  await page.getByRole("button", { name: label }).click();
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
});

try {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(800);
  await snap(page, "frame-01-landing.png");

  // IPI exploit demo (Demo mode is default)
  await clickPreset(page, "Web Exploit Trigger (IPI)");
  await page.waitForSelector("text=Threat verdict", { timeout: 30_000 });
  await page.waitForTimeout(600);
  await snap(page, "frame-02-ipi-detected.png");

  // Clean vector
  await clickPreset(page, "Clean Vector Test");
  await page.waitForSelector("text=Threat verdict", { timeout: 30_000 });
  await page.waitForTimeout(600);
  await snap(page, "frame-03-clean-pass.png");

  console.log("OUT_DIR=" + outDir);
} finally {
  await browser.close();
}
