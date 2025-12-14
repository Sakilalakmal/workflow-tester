import { executionPhase } from "./generated/prisma/client";

type Phase = Pick<executionPhase, "creditsConsumed">;
export function GetPhasesCosts(phases: Phase[]) {
  return phases.reduce((total, phase) => total + (phase.creditsConsumed || 0), 0);
}
