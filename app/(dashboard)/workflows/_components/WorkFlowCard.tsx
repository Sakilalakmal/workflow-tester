"use client";

import ToolTipWrapper from "@/components/ToolTipWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workflow } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflows/workflow";
import {
  FileTextIcon,
  LucideShuffle,
  MoreHorizontalIcon,
  PlayCircleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { set } from "zod";
import DeleteWorkFlowDialog from "./DeleteWorkFlowDialog";

const statusColros = {
  [WorkflowStatus.DRAFT]: "bg-yellow-300 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-green-500",
};

function WorkFlowCard({ workflowData }: { workflowData: Workflow }) {
  const isDraft = workflowData.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[120px]">
        <div className="flex items-center justify-end space-x-4">
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center",
              statusColros[workflowData.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="size-4" />
            ) : (
              <PlayCircleIcon className="size-4" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflowData.id}`}
                className="
            flex items-center hover:underline"
              >
                {workflowData.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 font-medium text-sm bg-yellow-200 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflows/editor/${workflowData.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "flex items-center gap-2"
            )}
          >
            <LucideShuffle className="size-4" />
            Edit Workflow
          </Link>
          <WorkFlowAction
            workFlowName={workflowData.name}
            workflowId={workflowData.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function WorkFlowAction({
  workFlowName,
  workflowId,
}: {
  workFlowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setshowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteWorkFlowDialog
        open={showDeleteDialog}
        setOpen={setshowDeleteDialog}
        workFlowName={workFlowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <ToolTipWrapper content={"More Actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreHorizontalIcon size={12} />
              </div>
            </ToolTipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="text-destructive flex items-center gap-2"
            onSelect={() => {
              setshowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon size={16} />
            delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default WorkFlowCard;
