"use client";

import { Workflow } from "@/lib/generated/prisma/client";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode/create-flow-node";
import { TaskType } from "@/types/workflows/Nodes/taks-types";
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponents";
import { useCallback, useEffect } from "react";
import { AppNode } from "@/types/workflows/Nodes/nodes";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdge, onEdgeChange] = useEdgesState<Edge>([]);

  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdge(flow.edges || []);

      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {}
  }, [workflow.definition, setEdge, setNodes, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const taskType = event.dataTransfer.getData("application/reactflow");
      if (!taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = CreateFlowNode(taskType as TaskType, position);
      setNodes((nodes) => [...nodes, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdge((edges) => addEdge({ ...connection, animated: true }, edges));
    },
    [setEdge]
  );

  return (
    <main className="h-full w-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgeChange}
        onNodesChange={onNodesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        onConnect={onConnect}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
