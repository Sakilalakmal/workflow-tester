"use client";

import { UpdateWorkFlow } from "@/actions/workflows/update-workflow-action";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { id } from "zod/v4/locales";

function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const { mutate: saveWorkflowMutation, isPending } = useMutation({
    mutationFn: UpdateWorkFlow,
    onSuccess: () => {
      toast.success("workflow saved", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("can't save this workflow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      disabled={isPending}
      variant={"default"}
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("saving ...", { id: "save-workflow" });
        saveWorkflowMutation({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <CheckCheckIcon size={4} className="text-blue-500" />
      save workflow
    </Button>
  );
}

export default SaveButton;
