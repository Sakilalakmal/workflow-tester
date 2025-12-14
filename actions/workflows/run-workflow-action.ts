"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/FlowToExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhasedStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflows/workflow";
import { auth } from "@clerk/nextjs/server";
import { ExecuteWorkFlow } from "@/lib/workflow/ExecuteWorkflow";

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
    console.error("FlowToExecutionPlan error:", result.error);
    throw new Error(`Invalid workflow definition: ${result.error.type}`);
  }

  if (!result.executionPlan) {
    throw new Error("Failed to generate execution plan");
  }

  const executionPlan = result.executionPlan;
  console.log("Execution plan generated:", executionPlan);

  try {
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.MANUAL,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId,
                status: ExecutionPhasedStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
      select: {
        id: true,
        phases: true,
      },
    });
    
    console.log("Execution created successfully:", execution);
    
    if (!execution) {
      throw new Error("workflow execution not created");
    }
    
    // Execute the workflow asynchronously
    ExecuteWorkFlow(execution.id).catch((error) => {
      console.error("Error executing workflow:", error);
    });
    
    return execution;
  } catch (error) {
    console.error("Error creating workflow execution:", error);
    throw error;
  }
}
