import { TaskType } from "@/types/workflows/Nodes/taks-types";
import { ExtractTextFromElement } from "./extrctTextFromElement";
import { LaunchBrowserTask } from "./launchBrowser";
import { PageToHtmlTask } from "./pageToHtml";
import { WorkflowTasks } from "@/types/workflows/workflow";

type Registry = {
  [K in TaskType]: WorkflowTasks & {type : K};
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
};
