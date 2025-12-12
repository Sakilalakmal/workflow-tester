import { TaskParamType, TaskType } from "@/types/workflows/Nodes/taks-types";
import { Code2Icon, Globe2Icon, LucideProps, TextWrapIcon } from "lucide-react";

export const ExtractTextFromElement = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "extract text from element",
  icon: (props: LucideProps) => (
    <TextWrapIcon className="text-blue-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
};
