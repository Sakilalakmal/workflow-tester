"use server";

import prisma from "@/lib/prisma";
import {
  CreateWorkflowInputTypes,
  createWorkflowSchema,
} from "@/schemas/workflows";
import { WorkflowStatus } from "@/types/workflows/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateWorkFlow(formData: CreateWorkflowInputTypes) {
  const { userId } = await auth();
  const { success, data } = createWorkflowSchema.safeParse(formData);

  if (!success) {
    throw new Error("invalid form data");
  }

  if (!userId) {
    throw new Error("unauthorized user");
  }

  const createWorkFlowResults = await prisma.workflow.create({
    data: {
      userId: userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  });

  if (!createWorkFlowResults) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${createWorkFlowResults.id}`);
}
