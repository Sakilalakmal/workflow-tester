import { TaskParamType, TaskType } from "@/types/workflows/Nodes/taks-types";
import { WorkflowTasks } from "@/types/workflows/workflow";
import { Globe2Icon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <Globe2Icon className="text-blue-500" {...props} />
  ),
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: "Web site url",
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hidehandle: true,
    },
  ],
  outputs: [{ name: "Web page", type: TaskParamType.BROWSER_INSTANCE }],
} satisfies WorkflowTasks;
