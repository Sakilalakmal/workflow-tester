import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().max(50).min(1, { message: "Worklfow must have a name" }),
  description: z.string().max(100).optional(),
});

export type CreateWorkflowInputTypes = z.infer<typeof createWorkflowSchema>;
