"use client";

import { RunWorkFlow } from "@/actions/workflows/run-workflow-action";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayCircleIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ExcuteButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const { mutate: planMutation, isPending } = useMutation({
    mutationFn: RunWorkFlow,
    onSuccess: () => {
      toast.success("Workflow execution started", { id: "workflow_execution" });
    },
    onError: () => {
      toast.error("Failed to start workflow execution", {
        id: "workflow_execution",
      });
    },
  });

  return (
    <Button
      disabled={isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        if (!plan) {
          return;
        }
        planMutation({ workflowId, definition: JSON.stringify(toObject()) });
      }}
    >
      <PlayCircleIcon className="size-4" />
      Run
    </Button>
  );
}

export default ExcuteButton;
