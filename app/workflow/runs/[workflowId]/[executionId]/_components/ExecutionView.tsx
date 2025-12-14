"use client";

import { WorkflowExecutionStatus } from "@/types/workflows/workflow";
import { useQuery } from "@tanstack/react-query";
import {
  executionPhase,
  WorkflowExecution,
} from "@/lib/generated/prisma/client";
import {
  Calendar1Icon,
  CircleDashed,
  ClockIcon,
  CoinsIcon,
  Loader2,
  LucideProps,
  WorkflowIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReactNode, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateToDurationString } from "@/lib/DateToDurationString";
import { GetPhasesCosts } from "@/lib/GetPhasesCosts";
import { GetWorkFlowPhaseDetails } from "@/actions/workflows/get-wrokflow-details";

type ExecutionData = WorkflowExecution & {
  phases: executionPhase[];
};

function ExecutionView({
  workflowexecution,
}: {
  workflowexecution: ExecutionData | null;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["workflowExecution", workflowexecution?.id],
    initialData: workflowexecution,
    queryFn: async () => {
      const response = await fetch(
        `/api/workflows/executions/${workflowexecution!.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch execution");
      return response.json();
    },
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const duration = DateToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkFlowPhaseDetails(selectedPhase || ""),
  });

  const creditsConsumed = GetPhasesCosts(query.data?.phases || []);

  return (
    <div className="flex w-full h-full">
      <aside className="w-[400px] min-w-[400px] max-w-[400px] border-r-2 border-separate flex grow flex-col overflow-hidden px-2">
        <div className="py-4 px-2">
          <ExecutionLabelsCompo
            icon={CircleDashed}
            label="Status"
            value={query.data?.status}
          />
          <ExecutionLabelsCompo
            icon={Calendar1Icon}
            label="Started at"
            value={
              query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data?.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <ExecutionLabelsCompo
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? duration : <Loader2 className="size-4 animate-spin" />
            }
          />
          <ExecutionLabelsCompo
            icon={CoinsIcon}
            label="Consume Credits"
            value={creditsConsumed}
          />
        </div>

        <Separator />
        <div className="flex justify-center items-center py-2 px-2">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={16} className="flex items-center" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase: executionPhase, index: number) => (
            <Button
              key={index}
              className="w-full justify-between cursor-pointer"
              variant={selectedPhase === phase.id ? "default" : "ghost"}
              onClick={() => {
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">{phase.status}</p>
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 2)}</pre>
      </div>
    </div>
  );
}

function ExecutionLabelsCompo({
  icon: Icon,
  label,
  value,
}: {
  icon: React.FC<LucideProps>;
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon className="size-4" />
        {label}
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}

export default ExecutionView;
