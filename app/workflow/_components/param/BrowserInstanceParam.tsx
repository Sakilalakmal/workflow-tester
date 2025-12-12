"use client";

import { ParamsProps } from "@/types/workflows/Nodes/nodes";

function BrowserInstanceParam({ param }: ParamsProps) {
  return <p className="text-xs">{param.name}</p>;
}

export default BrowserInstanceParam;
