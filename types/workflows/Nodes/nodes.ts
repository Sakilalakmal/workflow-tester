/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./taks-types";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface ParamsProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
}
