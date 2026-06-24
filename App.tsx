import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Tasks from "@/pages/tasks";
import MlTasks from "@/pages/ml-tasks";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
};

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Redirect to="/tasks" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/tasks">
        {() => <ProtectedRoute component={Tasks} />}
      </Route>
      <Route path="/ml">
        {() => <ProtectedRoute component={MlTasks} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
