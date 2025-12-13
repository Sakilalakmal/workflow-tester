"use client";

import { AppNodeMissingInputs } from "@/types/workflows/Nodes/nodes";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearError: () => void;
};

export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null);

export function FlowValidationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );

  const clearError = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{ invalidInputs, setInvalidInputs, clearError }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}
