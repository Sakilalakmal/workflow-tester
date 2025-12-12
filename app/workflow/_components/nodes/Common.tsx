import { TaskParamType } from "@/types/workflows/Nodes/taks-types";

export const CoolorHandle: Record<TaskParamType, string> = {
  [TaskParamType.BROWSER_INSTANCE]: "bg-blue-400!",
  [TaskParamType.STRING]: "bg-green-400!",
};
