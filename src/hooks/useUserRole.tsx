import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "agent" | "user";

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setRoles([]); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => {
      if (cancelled) return;
      setRoles((data || []).map((r: { role: AppRole }) => r.role));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  return {
    roles, loading,
    isAdmin: roles.includes("admin"),
    isAgent: roles.includes("agent"),
  };
}