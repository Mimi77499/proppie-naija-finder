import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/proppie-logo.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check hash for recovery token
    if (window.location.hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Link to="/"><img src={logo} alt="PropPie" className="mx-auto h-10 object-contain" /></Link>
          <h1 className="text-xl font-bold text-foreground">Invalid or expired link</h1>
          <p className="text-sm text-muted-foreground">This password reset link is no longer valid. Please request a new one.</p>
          <Button asChild className="w-full"><Link to="/auth">Back to Sign In</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Link to="/"><img src={logo} alt="PropPie" className="h-10 object-contain" /></Link>
          <h1 className="text-xl font-bold text-foreground">Set a new password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">New Password</label>
            <Input
              id="password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={6} autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium text-foreground">Confirm Password</label>
            <Input
              id="confirm" type="password" placeholder="••••••••"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              required minLength={6} autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
