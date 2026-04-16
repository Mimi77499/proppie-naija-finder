import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/proppie-logo.png";
import authBg from "@/assets/auth-bg.jpg";

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
    login: { heading: "Welcome Back", sub: "Sign in to continue your property search" },
    signup: { heading: "Join PropPie", sub: "Create an account to find your dream property" },
    forgot: { heading: "Reset Password", sub: "We'll send a reset link to your email" },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={authBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-secondary/75 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <Link to="/">
            <img src={logo} alt="PropPie" className="h-12 object-contain drop-shadow-lg" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary-foreground">{titles[view].heading}</h1>
            <p className="mt-1 text-sm text-primary-foreground/70">{titles[view].sub}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-primary-foreground/10 bg-background/90 p-6 shadow-elevated backdrop-blur-md"
        >
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
                  ? "Create Account"
                  : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-primary-foreground/80">
          {view === "login" ? (
            <>Don't have an account?{" "}
              <button type="button" onClick={() => setView("signup")} className="font-semibold text-primary hover:underline">Create Account</button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button type="button" onClick={() => setView("login")} className="font-semibold text-primary hover:underline">Sign In</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
