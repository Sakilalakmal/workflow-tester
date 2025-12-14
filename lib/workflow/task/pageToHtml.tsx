import { TaskParamType, TaskType } from "@/types/workflows/Nodes/taks-types";
import { WorkflowTasks } from "@/types/workflows/workflow";
import { Code2Icon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "get html from page",
  icon: (props: LucideProps) => (
    <Code2Icon className="text-blue-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
    },
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
  credits: 2,
} satisfies WorkflowTasks;
