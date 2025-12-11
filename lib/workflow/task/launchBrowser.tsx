import { TaskType } from "@/types/workflows/Nodes/taks-types";
import { Globe2Icon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <Globe2Icon className="text-blue-500" {...props} />
  ),
  isEntryPoint: true,
};
