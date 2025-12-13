"use client";

import ToolTipWrapper from "@/components/ToolTipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveButton from "./SaveButton";
import ExcuteButton from "./ExcuteButton";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
}

function Topbar({ title, subtitle, workflowId, hideButtons = false }: Props) {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <ToolTipWrapper content="Back">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              router.back();
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </ToolTipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {!hideButtons && (
        <div className="flex gap-1 flex-1 justify-end">
          <ExcuteButton workflowId={workflowId} />
          <SaveButton workflowId={workflowId} />
        </div>
      )}
    </header>
  );
}

export default Topbar;
