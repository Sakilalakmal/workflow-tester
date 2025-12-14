import { ExecutionEnvironmentType } from "@/types/Executor";
import * as cheerio from "cheerio";
import { ExtractTextFromElement } from "./workflow/task/extrctTextFromElement";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironmentType<typeof ExtractTextFromElement>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      return false;
    }

    const html = environment.getInput("Html");
    if (!html) {
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error("No element found for selector:", selector);
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.error("No text extracted from element with selector:", selector);
      return false;
    }

    environment.setOutput("Html", extractedText);

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
