import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function SaveButton({ propertyId, className }: { propertyId: string; className?: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("favorites").select("id").eq("user_id", user.id).eq("property_id", propertyId).maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, propertyId]);

  const toggle = async () => {
    if (!user) {
      toast({ title: "Sign in to save", description: "Create an account to save properties." });
      navigate("/auth");
      return;
    }
    setBusy(true);
    if (saved) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("property_id", propertyId);
      setSaved(false);
      toast({ title: "Removed from saved" });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, property_id: propertyId });
      setSaved(true);
      toast({ title: "Saved!", description: "Find it in your favorites." });
    }
    setBusy(false);
  };

  return (
    <button onClick={toggle} disabled={busy}
      className={className || "flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"}>
      <Heart className={`h-5 w-5 ${saved ? "fill-destructive text-destructive" : "text-foreground"}`} />
    </button>
  );
}