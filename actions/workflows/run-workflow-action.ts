"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/FlowToExecutionPlan";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkFlow(form: {
  workflowId: string;
  definition?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { workflowId, definition } = form;

  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (!definition) {
    throw new Error("Workflow definition is not found");
  }

  const flow = JSON.parse(definition);

  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("Invalid workflow definition");
  }

  if (!result.executionPlan) {
    throw new Error("Failed to generate execution plan");
  }

  const executionPlan = result.executionPlan;
  console.log("Generated Execution Plan:", executionPlan);

  return executionPlan;
}
