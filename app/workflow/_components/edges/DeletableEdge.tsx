"use client";

import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

export default function DeletableEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50% , -50%) translate(${labelX}px , ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Button
            variant={"destructive"}
            className="size-5 border cursor-pointer
          rounded-full text-xs leading-none hover:shadow-lg"
            onClick={() => {
              setEdges((eds) => eds.filter((e) => e.id !== props.id));
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
