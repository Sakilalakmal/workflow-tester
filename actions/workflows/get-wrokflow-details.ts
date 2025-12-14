"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkFlowPhaseDetails(phaseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      workflowExecution: {
        userId,
      },
    },
  });
}
