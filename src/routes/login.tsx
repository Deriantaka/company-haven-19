import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Activity, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthed, signIn } from "@/lib/api/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login — VIBSENSE" }, { name: "description", content: "Sign in to VIBSENSE industrial monitoring." }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed()) navigate({ to: "/" });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your credentials");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signIn(username, password);
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.97_0.01_250)] px-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-hover)] md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-[image:var(--gradient-primary)] p-10 text-[oklch(0.25_0.08_260)] md:flex">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <span className="text-xl font-bold tracking-wide">VIBSENSE</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Bring maintenance to the next level.</h2>
            <p className="mt-3 max-w-xs text-sm opacity-80">
              Predictive vibration intelligence for industrial machinery — companies, factories, machines, and sensors in one place.
            </p>
          </div>
          <p className="text-xs opacity-70">© 2026 VIBSENSE · powered by Komune Studio</p>
        </div>
        <form onSubmit={submit} className="flex flex-col justify-center p-8 md:p-12">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to monitor your machines.</p>
          <div className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="pl-9"
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-9"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Log in with your administrator credentials.</p>
          </div>
        </form>
      </div>
    </div>
  );
}