import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/workflows/Nodes/taks-types";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import { NodeParamField } from "./NodeParamField";
import { CoolorHandle } from "./Common";
import { is } from "zod/v4/locales";

export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  const edges = useEdges();

  const inConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      <NodeParamField param={input} nodeId={nodeId} disabled={inConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!inConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "bg-muted-foreground! border-2! border-background! -left-1! w-4! h-4!",
            CoolorHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
