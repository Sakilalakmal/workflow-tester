import { AppNode } from "@/types/workflows/Nodes/nodes";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflows/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

type FlowToExecutionPlanResult = {
  executionPlan?: WorkflowExecutionPlan;
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanResult {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error("No entry point found in the workflow");
  }

  const planned = new Set<string>();
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  for (
    let phase = 2;
    phase <= nodes.length || planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNodes of nodes) {
      if (planned.has(currentNodes.id)) {
        // node already put in the execution plan
        continue;
      }

      const isValidInput = getInvalidInputs(currentNodes, edges, planned);
      if (isValidInput.length > 0) {
        const incomers = getIncomers(currentNodes, nodes, edges);

        if (incomers.every((incomer) => planned.has(incomer.id))) {
          //incoming invalid inputs
        }
      } else {
        continue;
      }

      nextPhase.nodes.push(currentNodes);
      planned.add(currentNodes.id);
    }
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
