import { AppNode } from "@/types/workflows/Nodes/nodes";
import { TaskType } from "@/types/workflows/Nodes/taks-types";

export function CreateFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "Node",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
}
