import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Phone, MapPin, Copy, CheckCircle2, XCircle, Clock } from "lucide-react";

type Application = {
  id: string; user_id: string | null; full_name: string; email: string; phone: string;
  agency_name: string | null; license_number: string | null; years_experience: number | null;
  bio: string | null; service_areas: string[] | null;
  status: "pending" | "approved" | "rejected"; created_at: string; rejection_reason: string | null;
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [apps, setApps] = useState<Application[]>([]);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [credentialModal, setCredentialModal] = useState<{ email: string; password: string } | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);

  const load = async () => {
    const { data } = await supabase.from("agent_applications").select("*").order("created_at", { ascending: false });
    setApps((data as Application[]) || []);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (authLoading || roleLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn't have admin privileges. To grant yourself admin access,
            insert a row into the <code>user_roles</code> table from the backend with your user id and role <code>admin</code>.
          </p>
          <p className="mt-2 text-xs text-muted-foreground break-all">Your user id: {user.id}</p>
          <Button asChild className="mt-6"><Link to="/">Back to home</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const approve = async (a: Application) => {
    setBusyId(a.id);
    try {
      const { data, error } = await supabase.functions.invoke("approve-agent", { body: { applicationId: a.id } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCredentialModal({ email: data.email, password: data.tempPassword });
      toast({ title: "Agent approved", description: "Share the temporary password with them now — it won't be shown again." });
      await load();
    } catch (e: any) {
      toast({ title: "Approval failed", description: e.message, variant: "destructive" });
    } finally { setBusyId(null); }
  };

  const reject = async () => {
    if (!rejectModal) return;
    setBusyId(rejectModal.id);
    const { error } = await supabase.from("agent_applications").update({
      status: "rejected", rejection_reason: rejectModal.reason, reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", rejectModal.id);
    setBusyId(null);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setRejectModal(null);
    toast({ title: "Application rejected" });
    await load();
  };

  const filtered = apps.filter((a) => a.status === tab);
  const counts = {
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(["pending", "approved", "rejected"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                tab === t ? "bg-secondary text-secondary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted"
              }`}>
              {t === "pending" ? <Clock className="h-3.5 w-3.5" /> : t === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {t} <span className="rounded-full bg-background/30 px-1.5 text-xs">{counts[t]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No {tab} applications
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{a.full_name}</h3>
                    <p className="text-xs text-muted-foreground">Applied {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  {tab === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setRejectModal({ id: a.id, reason: "" })} disabled={busyId === a.id}>Reject</Button>
                      <Button size="sm" onClick={() => approve(a)} disabled={busyId === a.id}>{busyId === a.id ? "Approving…" : "Approve"}</Button>
                    </div>
                  )}
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {a.email}</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {a.phone}</p>
                  {a.agency_name && <p className="text-muted-foreground">🏢 {a.agency_name}</p>}
                  {a.license_number && <p className="text-muted-foreground">📜 {a.license_number}</p>}
                  {a.years_experience != null && <p className="text-muted-foreground">⏳ {a.years_experience} year(s) experience</p>}
                </div>
                {a.service_areas && a.service_areas.length > 0 && (
                  <p className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {a.service_areas.map((s) => <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs">{s}</span>)}
                  </p>
                )}
                {a.bio && <p className="mt-3 text-sm text-foreground">{a.bio}</p>}
                {a.rejection_reason && <p className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">Reason: {a.rejection_reason}</p>}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Credentials modal */}
      {credentialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-elevated">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <h3 className="mt-3 text-xl font-bold">Agent approved</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Send these credentials to the new agent. <strong>This password is shown only once.</strong>
            </p>
            <div className="mt-4 space-y-2 rounded-lg bg-muted p-3 font-mono text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="break-all">{credentialModal.email}</span>
                <button onClick={() => navigator.clipboard.writeText(credentialModal.email)}><Copy className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="break-all">{credentialModal.password}</span>
                <button onClick={() => navigator.clipboard.writeText(credentialModal.password)}><Copy className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => setCredentialModal(null)}>Done</Button>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-elevated">
            <h3 className="text-xl font-bold">Reject application</h3>
            <p className="mt-1 text-sm text-muted-foreground">Optionally provide a reason — visible to the applicant.</p>
            <Textarea className="mt-3" rows={4} placeholder="e.g. Incomplete license info"
              value={rejectModal.reason} onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })} />
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setRejectModal(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={reject}>Reject</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}