"use client";

import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon } from "lucide-react";
import React from "react";

function ExcuteButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.log(plan);
      }}
    >
      <PlayCircleIcon className="size-4" />
      Run
    </Button>
  );
}

export default ExcuteButton;
