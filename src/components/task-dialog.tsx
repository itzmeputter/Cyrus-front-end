import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAddTask, useUpdateTask, getGetTasksQueryKey, getGetMlTasksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@workspace/api-client-react";

const taskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  importance: z.number().min(1).max(10),
  effort: z.number().min(1).max(10),
  urgency: z.number().min(1).max(10),
  time: z.number().min(1).max(24),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditing = !!task;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      importance: 5,
      effort: 5,
      urgency: 5,
      time: 1,
    },
  });

  useEffect(() => {
    if (task && open) {
      form.reset({
        name: task.name,
        importance: task.importance,
        effort: task.effort,
        urgency: task.urgency,
        time: task.time,
      });
    } else if (!open) {
      form.reset({
        name: "",
        importance: 5,
        effort: 5,
        urgency: 5,
        time: 1,
      });
    }
  }, [task, open, form]);

  const addMutation = useAddTask();
  const updateMutation = useUpdateTask();

  const isPending = addMutation.isPending || updateMutation.isPending;

  function onSubmit(data: TaskFormValues) {
    if (isEditing) {
      updateMutation.mutate(
        { taskId: task.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetMlTasksQueryKey() });
            toast({ title: "Task updated" });
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Failed to update task", variant: "destructive" });
          },
        }
      );
    } else {
      addMutation.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetMlTasksQueryKey() });
            toast({ title: "Task created" });
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Failed to create task", variant: "destructive" });
          },
        }
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="What needs to be done?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="importance"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Importance</FormLabel>
                      <span className="text-xs text-muted-foreground">{field.value}/10</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1} max={10} step={1}
                        value={[field.value]}
                        onValueChange={(val) => field.onChange(val[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Urgency</FormLabel>
                      <span className="text-xs text-muted-foreground">{field.value}/10</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1} max={10} step={1}
                        value={[field.value]}
                        onValueChange={(val) => field.onChange(val[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="effort"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Effort</FormLabel>
                      <span className="text-xs text-muted-foreground">{field.value}/10</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1} max={10} step={1}
                        value={[field.value]}
                        onValueChange={(val) => field.onChange(val[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Time (Hours)</FormLabel>
                      <span className="text-xs text-muted-foreground">{field.value}h</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1} max={24} step={1}
                        value={[field.value]}
                        onValueChange={(val) => field.onChange(val[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
