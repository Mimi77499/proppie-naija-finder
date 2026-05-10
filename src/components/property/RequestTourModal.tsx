import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Calendar, Video, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(10).max(20),
  preferred_date: z.string().min(1, "Pick a date"),
  preferred_time: z.string().min(1, "Pick a time"),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export default function RequestTourModal({ propertyId, propertyTitle, open, onClose }: {
  propertyId: string; propertyTitle: string; open: boolean; onClose: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in_person" | "video">("in_person");
  const [submitting, setSubmitting] = useState(false);
  const [d, setD] = useState({
    full_name: "", email: user?.email || "", phone: "",
    preferred_date: "", preferred_time: "10:00 AM", notes: "",
  });

  if (!open) return null;

  const submit = async () => {
    if (!user) { onClose(); navigate("/auth"); return; }
    const r = schema.safeParse(d);
    if (!r.success) return toast({ title: "Check the form", description: r.error.errors[0].message, variant: "destructive" });
    setSubmitting(true);
    const { error } = await supabase.from("tour_requests").insert({
      user_id: user.id, property_id: propertyId, mode,
      full_name: r.data.full_name, email: r.data.email, phone: r.data.phone,
      preferred_date: r.data.preferred_date, preferred_time: r.data.preferred_time,
      notes: r.data.notes || null,
    });
    setSubmitting(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Tour requested!", description: "An agent will reach out to confirm." });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-elevated">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">Request a tour</h3>
            <p className="text-xs text-muted-foreground">{propertyTitle}</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {([["in_person", "In person", MapPin], ["video", "Video tour", Video]] as const).map(([v, label, Icon]) => (
            <button key={v} onClick={() => setMode(v)}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition ${
                mode === v ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
              }`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <Input placeholder="Full name" value={d.full_name} onChange={(e) => setD({ ...d, full_name: e.target.value })} />
          <Input type="email" placeholder="Email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} />
          <Input placeholder="Phone (+234 ...)" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={d.preferred_date} min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setD({ ...d, preferred_date: e.target.value })} />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={d.preferred_time} onChange={(e) => setD({ ...d, preferred_time: e.target.value })}>
              {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) =>
                <option key={t}>{t}</option>)}
            </select>
          </div>
          <Textarea rows={3} placeholder="Anything we should know? (optional)" value={d.notes}
            onChange={(e) => setD({ ...d, notes: e.target.value })} />
        </div>

        <Button className="mt-4 w-full" onClick={submit} disabled={submitting}>
          <Calendar className="mr-2 h-4 w-4" /> {submitting ? "Submitting…" : "Request tour"}
        </Button>
      </div>
    </div>
  );
}