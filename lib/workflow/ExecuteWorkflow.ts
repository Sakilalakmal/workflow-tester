"use server";

import prisma from "../prisma";
import {
  ExecutionPhasedStatus,
  WorkflowExecutionStatus,
} from "@/types/workflows/workflow";
import { executionPhase, Prisma } from "../generated/prisma/client";
import { AppNode } from "@/types/workflows/Nodes/nodes";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "../ExecutorRegistry";
import { EnvironmentType, ExecutionEnvironmentType } from "@/types/Executor";
import { TaskParamType } from "@/types/workflows/Nodes/taks-types";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";

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

  const edges = JSON.parse(execution.workflow.definition).edges as Edge[];

  const environment: EnvironmentType = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);

  await intializephaseStatus(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // Execute each phase
    const phaseExecution = await executePhase(phase, environment, edges);
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

  await cleanupEnvironment(environment);
  // Note: revalidatePath removed - should be called from the API route or action that invokes this function
  // to avoid "revalidatePath during render" error in Next.js
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

async function executePhase(
  phase: executionPhase,
  environment: EnvironmentType,
  edges: Edge[]
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvirontmentForPhase(node, environment, edges);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhasedStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const success = await executedPhase(phase, node, environment);
  const outputs = environment.phases[node.id].outputs;
  const completedAt = new Date();
  const creditsConsumed = TaskRegistry[node.data.type].credits; // Calculate based on actual task execution

  await finalizePhaseExecution(
    phase.id,
    success,
    outputs,
    completedAt,
    creditsConsumed
  );

  return { success, creditsConsumed };
}

async function finalizePhaseExecution(
  phaseId: string,
  success: boolean,
  outputs: Record<string, string>,
  completedAt: Date,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhasedStatus.COMPLETED
    : ExecutionPhasedStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt,
      outputs: JSON.stringify(outputs),
      creditsConsumed,
    },
  });
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

async function executedPhase(
  phase: executionPhase,
  node: AppNode,
  environment: EnvironmentType
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  const task = TaskRegistry[node.data.type];
  const executionEnvironment: ExecutionEnvironmentType<typeof task> =
    createExecutionEnvironment(node, environment);

  return await runFn(executionEnvironment);
}

function setupEnvirontmentForPhase(
  node: AppNode,
  environment: EnvironmentType,
  edges: Edge[]
) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };

  const inputs = TaskRegistry[node.data.type].inputs;
  console.log(`Setting up environment for node ${node.id} (${node.data.type})`);
  console.log(
    "Available inputs from task definition:",
    inputs.map((i) => i.name)
  );
  console.log("Node data inputs:", node.data.inputs);

  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;

    // Check for connected edges first (higher priority)
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (connectedEdge) {
      // Get output value from connected node
      const outputValue =
        environment.phases[connectedEdge.source]?.outputs?.[
          connectedEdge.sourceHandle!
        ];

      if (outputValue !== undefined) {
        environment.phases[node.id].inputs[input.name] = outputValue;
        console.log(`✓ Connected input "${input.name}" from previous node`);
      } else {
        console.log(
          `✗ Connected edge exists but no output value for "${input.name}"`
        );
      }
      continue;
    }

    // No connected edge, use static value from node data
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      console.log(`✓ Set static input "${input.name}" = "${inputValue}"`);
    } else {
      console.log(`✗ Missing input "${input.name}"`);
    }
  }

  console.log("Final phase inputs:", environment.phases[node.id].inputs);
}

function createExecutionEnvironment(
  node: AppNode,
  environment: EnvironmentType
) {
  return {
    getInput: (name: string) => environment.phases[node.id].inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser || null,
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    browser: environment.browser,
    page: environment.page,
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },
  };
}

async function cleanupEnvironment(environment: EnvironmentType) {
  if (environment.browser) {
    try {
      await environment.browser.close().catch((err) => {
        console.error("Error closing browser during cleanup:", err);
      });
      console.log("Browser closed successfully during cleanup");
    } catch (error) {
      console.error("Error closing browser during cleanup:", error);
    }
  }
}
