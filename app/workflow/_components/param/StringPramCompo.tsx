import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParamsProps } from "@/types/workflows/Nodes/nodes";
import { TaskParam } from "@/types/workflows/Nodes/taks-types";
import { useId, useState } from "react";

export function StringParam({
  param,
  value,
  updateNodeParamValue,
}: ParamsProps) {
  const id = useId();

  const [internalvalue, setInternalValue] = useState(value || "");

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className=" flex items-center">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Input
        id={id}
        value={internalvalue}
        placeholder="enter value here"
        onChange={(e) => {
          setInternalValue(e.target.value);
        }}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
}
