import { AppNode, AppNodeMissingInputs } from "@/types/workflows/Nodes/nodes";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflows/workflow";
import { TaskRegistry } from "./task/registry";

// Define Edge type locally to avoid React Flow client-side dependency
type Edge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

export enum FlowToExecutionPlanValidationErrorType {
  NO_ENTRY_POINT = "NO_ENTRY_POINT",
  MISSING_REQUIRED_INPUTS = "MISSING_REQUIRED_INPUTS",
  INVALID_CYCLIC_DEPENDENCY = "INVALID_CYCLIC_DEPENDENCY",
  INVALID_INPUTS = "INVALID_INPUTS",
}

type FlowToExecutionPlanResult = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationErrorType;
    invalidElements?: AppNodeMissingInputs[];
  };
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanResult {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationErrorType.NO_ENTRY_POINT,
      },
    };
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();
  const inValidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (inValidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: inValidInputs,
    });
  }
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNodes of nodes) {
      if (planned.has(currentNodes.id)) {
        // node already put in the execution plan
        continue;
      }

      const invalidInputs = getInvalidInputs(currentNodes, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNodes, nodes, edges);

        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // All dependencies are planned, but inputs are still invalid
          inputsWithErrors.push({
            nodeId: currentNodes.id,
            inputs: invalidInputs,
          });
        }
        // Skip this node for now if it has invalid inputs
        continue;
      }

      // Node has valid inputs, add it to this phase
      nextPhase.nodes.push(currentNodes);
    }

    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    
    if (nextPhase.nodes.length > 0) {
      executionPlan.push(nextPhase);
    }
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationErrorType.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }
  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const inValidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs?.[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      continue;
    }
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputEdgedByOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByOutput =
      input.required &&
      inputEdgedByOutput &&
      planned.has(inputEdgedByOutput.source);

    if (requiredInputProvidedByOutput) {
      continue;
    } else if (!input.required) {
      if (!inputEdgedByOutput) continue;
      if (inputEdgedByOutput && planned.has(inputEdgedByOutput.source)) {
        continue;
      }
    }

    inValidInputs.push(input.name);
  }

  return inValidInputs;
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) return [];

  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });

  return nodes.filter((n) => incomersIds.has(n.id));
}
