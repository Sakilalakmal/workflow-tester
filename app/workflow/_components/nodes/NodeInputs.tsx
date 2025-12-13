import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/workflows/Nodes/taks-types";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import { NodeParamField } from "./NodeParamField";
import { CoolorHandle } from "./Common";
import { is } from "zod/v4/locales";
import useFlowValidation from "@/components/hooks/useFlowValidation";

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
  const { invalidInputs } = useFlowValidation();
  const edges = useEdges();

  const inConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "border-destructive border-2"
      )}
    >
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
