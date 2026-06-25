import { useState } from "react";
import { useLocation, Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import cyrusLogo from "@assets/CyrusV.1Logo_1781971950289.jpg";

// TEMP SIGNUP HOOK (Render-safe placeholder)
const useSignup = () => {
  return {
    mutate: (data: any) => {
      console.log("Signup not connected yet:", data);
    },
    isPending: false,
  };
};

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const signupMutation = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  signupMutation.mutate({ email, password });

  toast({
    title: "Signup simulated",
    description: "Backend not connected yet.",
  });

  setLocation("/login");
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <img
          src={cyrusLogo}
          alt="Cyrus"
          className="h-16 w-16 mx-auto rounded-md shadow-xl mb-4"
        />
        <h1 className="text-3xl font-bold tracking-tight">Project Cyrus</h1>
        <p className="text-muted-foreground mt-2">
          Initialize your command center
        </p>
      </div>

      <Card className="w-full max-w-md border-border shadow-2xl bg-card">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
                placeholder="commander@cyrus.app"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full font-bold">
              Initialize
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
