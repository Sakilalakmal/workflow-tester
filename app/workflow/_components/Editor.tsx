import { Workflow } from "@/lib/generated/prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/topbar";

function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <Topbar
          title="Workflow Editor"
          subtitle="create your workflow in here without pain"
          workflowId={workflow.id}
        />
        <section className="flex-1 flex w-full">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;
