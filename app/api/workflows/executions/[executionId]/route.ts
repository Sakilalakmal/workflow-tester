import { GetWorkflowExecutionswithPhases } from "@/actions/workflows/GetWorkflowExecutionswithPhases";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ executionId: string }> }
) {
  const { executionId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const execution = await GetWorkflowExecutionswithPhases(executionId);

    if (!execution) {
      return NextResponse.json(
        { error: "Execution not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(execution);
  } catch (error) {
    console.error("Error fetching execution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
