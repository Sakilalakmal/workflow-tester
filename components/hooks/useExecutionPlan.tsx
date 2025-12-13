import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationErrorType,
} from "@/lib/workflow/FlowToExecutionPlan";
import { AppNode, AppNodeMissingInputs } from "@/types/workflows/Nodes/nodes";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";

type ExecutionPlanError = {
  type: FlowToExecutionPlanValidationErrorType;
  invalidElements?: AppNodeMissingInputs[];
};

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearError } = useFlowValidation();

  const handleError = useCallback(
    (error: ExecutionPlanError) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationErrorType.NO_ENTRY_POINT:
          toast.error("No Entry found for this workflow");
          break;
        case FlowToExecutionPlanValidationErrorType.INVALID_INPUTS:
          toast.error("Not all inputs values are set");
          setInvalidInputs(error.invalidElements || []);
          break;
        default:
          toast.error("something wrong in this workflow");
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();

    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearError();

    return executionPlan;
  }, [toObject, handleError, clearError]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
