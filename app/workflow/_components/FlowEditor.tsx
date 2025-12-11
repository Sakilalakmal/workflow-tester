"use client";

import { Workflow } from "@/lib/generated/prisma/client";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode/create-flow-node";
import { TaskType } from "@/types/workflows/Nodes/taks-types";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponents";

const nodeTypes = {
  Node: NodeComponent,
};

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    CreateFlowNode(TaskType.LAUNCH_BROWSER),
  ]);
  const [edges, setEdge, onEdgeChange] = useEdgesState([]);

  return (
    <main className="h-full w-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgeChange}
        onNodesChange={onNodesChange}
        fitView
        nodeTypes={nodeTypes}
      >
        <Controls position="top-left" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
