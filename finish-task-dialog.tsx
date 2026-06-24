import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFinishTask, getGetTasksQueryKey, getGetMlTasksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@workspace/api-client-react";

const finishSchema = z.object({
  outcome: z.number().min(1).max(10),
});

type FinishFormValues = z.infer<typeof finishSchema>;

interface FinishTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function FinishTaskDialog({ open, onOpenChange, task }: FinishTaskDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FinishFormValues>({
    resolver: zodResolver(finishSchema),
    defaultValues: {
      outcome: 5,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ outcome: 5 });
    }
  }, [open, form]);

  const finishMutation = useFinishTask();

  function onSubmit(data: FinishFormValues) {
    if (!task) return;
    
    finishMutation.mutate(
      { taskId: task.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMlTasksQueryKey() });
          toast({ title: "Task completed" });
          onOpenChange(false);
        },
        onError: () => {
          toast({ title: "Failed to mark as done", variant: "destructive" });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Task</DialogTitle>
          <DialogDescription>
            Rate the outcome of "{task?.name}". The ML model will use this to improve future prioritization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Outcome Score</FormLabel>
                    <span className="text-xs text-muted-foreground font-bold">{field.value}/10</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1} max={10} step={1}
                      value={[field.value]}
                      onValueChange={(val) => field.onChange(val[0])}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground pt-2">
                    1 = Total failure / waste of time<br/>
                    10 = Massive success / high impact
                  </p>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={finishMutation.isPending}>
                {finishMutation.isPending ? "Saving..." : "Mark Complete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
