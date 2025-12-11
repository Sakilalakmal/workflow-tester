import { DeleteWorkFlowAction } from "@/actions/workflows/delete-workflow-action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteWorkFlowDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  workFlowName: string;
  workflowId: string;
}

function DeleteWorkFlowDialog({
  open,
  setOpen,
  workFlowName,
  workflowId,
}: DeleteWorkFlowDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: DeleteWorkFlowAction,
    onSuccess: () => {
      toast.success("workflow deleted successfully", { id: "workflow-delete" });
      setOpen(false);
      setConfirmText("");
    },
    onError: () => {
      toast.error("failed to delete workflow", { id: "workflow-delete" });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure about this?</AlertDialogTitle>
          <AlertDialogDescription>
            {" "}
            This action cannot be undone. This will permanently delete the
            workflow.
            <div className="flex flex-col py-4 gap-4">
              <p className="text-sm text-muted-foreground">
                if you are sure about this enter <b>{workFlowName}</b> to
                confirm delete
              </p>

              <Input
                placeholder="confirm worklflow name"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            disabled={confirmText !== workFlowName || isPending}
            onClick={() => {
              toast.loading("deleting workflow...", { id: "workflow-delete" });
              deleteMutation(workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteWorkFlowDialog;
