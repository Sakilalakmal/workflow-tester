import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkFlowForUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflowsData = await prisma.workflow.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

   return workflowsData;
}
