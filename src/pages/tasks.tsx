import { useState } from "react";
import { Layout } from "@/components/layout";
import { TaskDialog } from "@/components/task-dialog";
import { FinishTaskDialog } from "@/components/finish-task-dialog";
import { useGetTasks, useDeleteTask, getGetTasksQueryKey, getGetMlTasksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, CheckCircle, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@workspace/api-client-react";

export default function Tasks() {
  const { data: tasks, isLoading, error } = useGetTasks();
  const deleteMutation = useDeleteTask();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishingTask, setFinishingTask] = useState<Task | null>(null);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(
        { taskId: id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetMlTasksQueryKey() });
            toast({ title: "Task deleted" });
          },
        }
      );
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  const handleFinish = (task: Task) => {
    setFinishingTask(task);
    setFinishDialogOpen(true);
  };

  const activeTasks = tasks?.filter((t) => !t.completed) || [];
  const completedTasks = tasks?.filter((t) => t.completed) || [];

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage your complete queue.</p>
          </div>
          <Button onClick={handleCreate} className="font-bold">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>

        {isLoading && <div className="text-muted-foreground">Loading tasks...</div>}
        {error && <div className="text-destructive">Failed to load tasks.</div>}

        {!isLoading && !error && activeTasks.length === 0 && completedTasks.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/50">
            <p className="text-muted-foreground">No tasks found. Create one to get started.</p>
          </div>
        )}

        {activeTasks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-foreground/80">Active Queue</h2>
            <div className="grid gap-3">
              {activeTasks.map((task) => (
                <div key={task.id} className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleFinish(task)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Circle className="h-6 w-6" />
                    </button>
                    <div>
                      <h3 className="font-medium text-lg">{task.name}</h3>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>I: {task.importance}</span>
                        <span>E: {task.effort}</span>
                        <span>U: {task.urgency}</span>
                        <span>{task.time}h</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground/80">Completed</h2>
            <div className="grid gap-3 opacity-60">
              {completedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium text-lg line-through">{task.name}</h3>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} task={editingTask} />
      <FinishTaskDialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen} task={finishingTask} />
    </Layout>
  );
}
