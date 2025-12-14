"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import {
  ExecutionPhasedStatus,
  WorkflowExecutionStatus,
} from "@/types/workflows/workflow";
import { executionPhase, Prisma } from "../generated/prisma/client";
import { AppNode } from "@/types/workflows/Nodes/nodes";
import { TaskRegistry } from "./task/registry";

type WorkflowExecutionWithPhases = Prisma.WorkflowExecutionGetPayload<{
  include: {
    workflow: true;
    phases: true;
  };
}>;

export async function ExecuteWorkFlow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);

  await intializephaseStatus(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // Execute each phase
    const phaseExecution = await executePhase(phase);
    creditsConsumed += phaseExecution.creditsConsumed;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizedWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  revalidatePath("/workflow/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function intializephaseStatus(execution: WorkflowExecutionWithPhases) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id),
      },
    },
    data: {
      status: ExecutionPhasedStatus.PENDING,
    },
  });
}

async function executePhase(phase: executionPhase) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhasedStatus.RUNNING,
      startedAt,
    },
  });

  // Simulate phase execution - replace this with actual task execution logic
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const completedAt = new Date();
  const creditsConsumed = TaskRegistry[node.data.type].credits; // Calculate based on actual task execution

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhasedStatus.COMPLETED,
      completedAt,
      creditsConsumed,
    },
  });

  return { success: true, creditsConsumed };
}

async function finalizedWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed: creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((error) => {
      console.error("Error updating workflow last run status:", error);
    });
}
