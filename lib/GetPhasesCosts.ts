import { executionPhase } from "./generated/prisma/client";

type Phase = Pick<executionPhase, "creditsCost">;
export function GetPhasesCosts(phases: Phase[]) {
  return phases.reduce((total, phase) => total + (phase.creditsCost || 0), 0);
}
