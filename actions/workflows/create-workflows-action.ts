"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode/create-flow-node";
import {
  CreateWorkflowInputTypes,
  createWorkflowSchema,
} from "@/schemas/workflows";
import { AppNode } from "@/types/workflows/Nodes/nodes";
import { TaskType } from "@/types/workflows/Nodes/taks-types";
import { WorkflowStatus } from "@/types/workflows/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";

export async function CreateWorkFlow(formData: CreateWorkflowInputTypes) {
  const { userId } = await auth();
  const { success, data } = createWorkflowSchema.safeParse(formData);

  if (!success) {
    throw new Error("invalid form data");
  }

  if (!userId) {
    throw new Error("unauthorized user");
  }

  const initialWorkFlowData: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  //inital flow entry point adding
  initialWorkFlowData.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const createWorkFlowResults = await prisma.workflow.create({
    data: {
      userId: userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialWorkFlowData),
      ...data,
    },
  });

  if (!createWorkFlowResults) {
    throw new Error("Failed to create workflow");
  }

  revalidatePath(`/workflows`);

  return createWorkFlowResults.id;
}
