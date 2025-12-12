import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode/create-flow-node";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/workflows/Nodes/nodes";
import { TaskType } from "@/types/workflows/Nodes/taks-types";
import { useReactFlow } from "@xyflow/react";
import {
  CoinsIcon,
  CopyCheckIcon,
  CopyIcon,
  GripVerticalIcon,
  Trash2Icon,
} from "lucide-react";

function NodeHeader({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  const task = TaskRegistry[taskType];

  const { deleteElements, getNode, addNodes } = useReactFlow();

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-2">
          {task.isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon className="size-16" />
            {task.credits} Credits
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() => {
                  deleteElements({
                    nodes: [{ id: nodeId }],
                  });
                }}
              >
                <Trash2Icon size={4} />
              </Button>

              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() => {
                  const node = getNode(nodeId) as AppNode;
                  const newX = node.position.x;
                  const newY =
                    node.position.y + (node.measured?.height ?? 0) + 20;
                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY,
                  });

                  addNodes(newNode);
                }}
              >
                <CopyIcon size={4} />
              </Button>
            </>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NodeHeader;
