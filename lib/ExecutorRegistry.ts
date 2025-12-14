import { TaskType } from "@/types/workflows/Nodes/taks-types";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtml";
import { ExecutionEnvironmentType } from "@/types/Executor";
import { Extends } from "./generated/prisma/internal/prismaNamespace";
import { WorkflowTasks } from "@/types/workflows/workflow";

type ExecutorFn<T extends WorkflowTasks> = (
  environment: ExecutionEnvironmentType<T>
) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTasks & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: () => Promise.resolve(true),
};
