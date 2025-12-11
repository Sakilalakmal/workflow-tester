import { GetWorkFlowForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BanIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateWorkFlowDialog from "./CreateWorkFlowDialog";
import WorkFlowCard from "./_components/WorkFlowCard";

function WorkFlowPage() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workflows here.
          </p>
        </div>
        <CreateWorkFlowDialog triggerText="Create a workflow" />
      </div>

      <div className="h-full py-8">
        <Suspense fallback={<UserWorkFlowSkeleton />}>
          <UserWorkFlows />
        </Suspense>
      </div>
    </div>
  );
}

export function UserWorkFlowSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
}

async function UserWorkFlows() {
  const workflows = await GetWorkFlowForUser();

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Alert variant={"destructive"}>
          <AlertCircle className="size-4" />
          <AlertTitle>No Workflows Found</AlertTitle>
          <AlertDescription>
            Something went wrong or you do not have any workflows...
          </AlertDescription>
        </Alert>
        <div className="rounded-full bg-accent size-20 flex items-center justify-center">
          <BanIcon className="size-20" />
        </div>

        <div className="flex flex-col text-center">
          <p className="font-bold">No Workflows Found</p>
          <p className="text-sm text-muted-foreground">
            Click below to create your first workflow.
          </p>
        </div>
        <CreateWorkFlowDialog triggerText="Create your first workflow" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkFlowCard key={workflow.id} workflowData={workflow} />
      ))}
    </div>
  );
}

export default WorkFlowPage;
