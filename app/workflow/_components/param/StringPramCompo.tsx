import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamsProps } from "@/types/workflows/Nodes/nodes";
import { TaskParam } from "@/types/workflows/Nodes/taks-types";
import { useEffect, useId, useState } from "react";

export function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamsProps) {
  const id = useId();

  const [internalvalue, setInternalValue] = useState(value || "");

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  let Component: React.ElementType = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className=" flex items-center">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component
        id={id}
        disabled={disabled}
        value={internalvalue}
        placeholder="enter value here"
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setInternalValue(e.target.value);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
}
