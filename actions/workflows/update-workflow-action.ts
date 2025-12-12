'use server';

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflows/workflow";
import { auth } from "@clerk/nextjs/server";

export async function UpdateWorkFlow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorized actions");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }

  await prisma.workflow.update({
    data: {
      definition: definition,
    },
    where: {
      id,
      userId,
    },
  });
}
