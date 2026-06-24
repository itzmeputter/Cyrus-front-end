import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, ListTodo, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import cyrusLogo from "@assets/CyrusV.1Logo_1781971950289.jpg";

export function Layout({ children }: { children: React.ReactNode }) {
  const { logout, email } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <img src={cyrusLogo} alt="Cyrus" className="h-8 w-8 rounded-sm mr-3" />
          <span className="font-bold text-lg tracking-tight uppercase">Cyrus</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/tasks" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${location === '/tasks' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <ListTodo className="h-4 w-4" />
            All Tasks
          </Link>
          <Link href="/ml" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${location === '/ml' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <BrainCircuit className="h-4 w-4" />
            ML Priority
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-3 px-2 truncate">
            {email}
          </div>
          <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
