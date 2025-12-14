import { ExecutionEnvironmentType } from "@/types/Executor";
import { PageToHtmlTask } from "./workflow/task/pageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironmentType<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Web Page", html);

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
