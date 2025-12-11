import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "../../_components/Editor";

async function EditorPage({ params }: { params: { workflowId: string } }) {
  const { workflowId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return <div>Please sign in to access the workflow editor.</div>;
  }

  const workFlows = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId: userId,
    },
  });

  if (!workFlows) {
    return <div>Workflow not found or you do not have access to it.</div>;
  }

  console.log("workFlows:", workFlows);

  return <Editor workflow={workFlows} />;
}

export default EditorPage;
