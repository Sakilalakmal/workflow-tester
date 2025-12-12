"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  CreateWorkflowInputTypes,
  createWorkflowSchema,
} from "@/schemas/workflows";
import { Layers2Icon, Loader } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkFlow } from "@/actions/workflows/create-workflows-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function CreateWorkFlowDialog({ triggerText }: { triggerText: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<CreateWorkflowInputTypes>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      description: "",
      name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateWorkFlow,
    onSuccess: (workflowId) => {
      toast.success("Workflows created Successfully", {
        id: "workflow-create",
      });
      router.push(`/workflow/editor/${workflowId}`);
    },
    onError: () => {
      toast.error("failed to create workflow", { id: "workflow-create" });
    },
  });

  const handleSubmit = useCallback(
    (values: CreateWorkflowInputTypes) => {
      toast.loading("creating workflow....", { id: "workflow-create" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "create a workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create a new workflow"
          subTitle="start to building your workflows"
        />
        <div className="p-8">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter name for your workflow"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      create a descriptive unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desctiption</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="enter a small description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      descriptive small sentence about your workflow job
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Generate Workflow"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkFlowDialog;
