import { Layout } from "@/components/layout";
import { useGetMlTasks } from "@workspace/api-client-react";
import { BrainCircuit, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function MlTasks() {
  const { data: mlTasks, isLoading, error } = useGetMlTasks();

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">ML Priority</h1>
          </div>
          <p className="text-muted-foreground">
            Tasks ranked by predicted outcome. The model learns from your past completions.
          </p>
        </div>

        {isLoading && <div className="text-muted-foreground">Computing priorities...</div>}
        {error && <div className="text-destructive">Failed to load ML priorities.</div>}

        {!isLoading && !error && (!mlTasks || mlTasks.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-lg bg-card/50">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">Not enough data yet</p>
            <p className="text-muted-foreground max-w-md text-center mt-2">
              The model needs more completed tasks with outcome ratings before it can accurately predict and prioritize your queue. Keep working!
            </p>
          </div>
        )}

        {mlTasks && mlTasks.length > 0 && (
          <div className="grid gap-4">
            {mlTasks.map((task, index) => {
              // Normalize score roughly for display (assuming raw score varies, let's treat it as a relative measure)
              // Since we just have the raw score, we'll just display it.
              const maxScore = Math.max(...mlTasks.map(t => t.score));
              const percentage = maxScore > 0 ? (task.score / maxScore) * 100 : 0;
              
              return (
                <div key={task.id} className="relative overflow-hidden bg-card border border-border rounded-lg p-5 flex items-center justify-between shadow-sm">
                  {/* Subtle rank indicator */}
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary/20"></div>
                  
                  <div className="flex items-center gap-6 z-10 w-full">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-lg font-bold text-foreground/80">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{task.name}</h3>
                      <div className="flex items-center gap-3 mt-2 w-full max-w-xs">
                        <span className="text-xs text-muted-foreground w-16">Score: {task.score.toFixed(2)}</span>
                        <Progress value={percentage} className="h-2 flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
