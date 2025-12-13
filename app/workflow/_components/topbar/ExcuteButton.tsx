import { Button } from "@/components/ui/button";
import { PlayCircleIcon } from "lucide-react";
import React from "react";

function ExcuteButton({ workflowId }: { workflowId: string }) {
  return (
    <Button variant={"outline"} className="flex items-center gap-2">
      <PlayCircleIcon className="size-4" />
      Run
    </Button>
  );
}

export default ExcuteButton;
