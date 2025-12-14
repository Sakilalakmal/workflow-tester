import { ExecutionEnvironmentType } from "@/types/Executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "./workflow/task/launchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironmentType<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    console.log("=== LaunchBrowserExecutor Started ===");

    // Get and validate the website URL input
    let websiteUrl = environment.getInput("Web site url");
    console.log(`Retrieved input "Web site url":`, websiteUrl);

    if (!websiteUrl) {
      console.error("Website URL is missing or empty!");
      throw new Error("Website URL is required but not provided");
    }

    // Add protocol if missing
    if (
      !websiteUrl.startsWith("http://") &&
      !websiteUrl.startsWith("https://")
    ) {
      websiteUrl = `https://${websiteUrl}`;
      console.log("Added https:// protocol to URL");
    }

    console.log("✓ Website URL validated:", websiteUrl);

    // Launch browser with recommended settings
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
      ],
    });

    console.log("Browser launched successfully");

    // Store browser instance in environment for later use
    environment.setBrowser(browser);

    // Open a new page
    const page = await browser.newPage();

    console.log("Navigating to:", websiteUrl);

    // Navigate to the website URL
    await page.goto(websiteUrl);
    environment.setPage(page);
    console.log("Page loaded successfully");

    return true;
  } catch (error) {
    console.error("Error launching browser:", error);

    // Clean up browser if it was created but navigation failed
    if (environment.browser) {
      try {
        await environment.browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }

    throw error;
  }
}
