import { GetWorkflowExecutionswithPhases } from "@/actions/workflows/GetWorkflowExecutionswithPhases";
import Topbar from "@/app/workflow/_components/topbar/topbar";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ExecutionView from "./_components/ExecutionView";

interface executionPageParams {
  workflowId: string;
  executionId: string;
}

async function ExecutionPage({
  params,
}: {
  params: Promise<executionPageParams>;
}) {
  const { workflowId, executionId } = await params;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Your workflow details"
        subtitle="see all details about your workflow"
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full justify-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
          }
        >
          <ExecutionVievWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionVievWrapper({ executionId }: { executionId: string }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflowExecution = await GetWorkflowExecutionswithPhases(executionId);

  //for debugging purposes
  console.log("workflowExecution", workflowExecution);

  if (!workflowExecution) {
    throw new Error("Workflow execution not found");
  }

  return <ExecutionView/>;
}

export default ExecutionPage;
