import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/proppie-logo.png";

type View = "login" | "signup" | "forgot";

export default function Auth() {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setView("login");
      } else if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "You've signed in successfully." });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({ title: "Welcome to PropPie!", description: "Your account has been created." });
        navigate("/");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<View, { heading: string; sub: string }> = {
    login: { heading: "Sign in to PropPie", sub: "Enter your credentials to continue" },
    signup: { heading: "Create your account", sub: "Sign up to start finding properties" },
    forgot: { heading: "Reset your password", sub: "We'll send a reset link to your email" },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Link to="/"><img src={logo} alt="PropPie" className="h-10 object-contain" /></Link>
          <h1 className="text-xl font-bold text-foreground">{titles[view].heading}</h1>
          <p className="text-sm text-muted-foreground">{titles[view].sub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <Input
              id="email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email"
            />
          </div>

          {view !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                {view === "login" && (
                  <button type="button" onClick={() => setView("forgot")} className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={view === "login" ? "current-password" : "new-password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : view === "login"
                ? "Sign In"
                : view === "signup"
                  ? "Sign Up"
                  : "Send Reset Link"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {view === "login" ? (
            <>Don't have an account?{" "}
              <button type="button" onClick={() => setView("signup")} className="font-medium text-primary hover:underline">Sign Up</button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button type="button" onClick={() => setView("login")} className="font-medium text-primary hover:underline">Sign In</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
