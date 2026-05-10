import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ChevronLeft, ChevronRight, X, CheckCircle2, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  offer_amount: z.coerce.number().min(100000, "Enter a realistic amount"),
  financing: z.enum(["cash", "mortgage", "installments", "other"]),
  down_payment: z.coerce.number().min(0).optional(),
  timeline: z.string().min(1).max(120),
  contingencies: z.string().max(500).optional().or(z.literal("")),
  message: z.string().max(500).optional().or(z.literal("")),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(10).max(20),
});

export default function StartOfferModal({ propertyId, propertyTitle, listPrice, open, onClose }: {
  propertyId: string; propertyTitle: string; listPrice: number; open: boolean; onClose: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [d, setD] = useState({
    offer_amount: listPrice,
    financing: "mortgage" as "cash" | "mortgage" | "installments" | "other",
    down_payment: Math.round(listPrice * 0.3),
    timeline: "Within 60 days",
    contingencies: "",
    message: "",
    full_name: "",
    email: user?.email || "",
    phone: "",
  });

  if (!open) return null;

  const submit = async () => {
    if (!user) { onClose(); navigate("/auth"); return; }
    const r = schema.safeParse(d);
    if (!r.success) return toast({ title: "Check the form", description: r.error.errors[0].message, variant: "destructive" });
    setSubmitting(true);
    const { error } = await supabase.from("offers").insert({
      user_id: user.id, property_id: propertyId,
      offer_amount: r.data.offer_amount, financing: r.data.financing,
      down_payment: r.data.down_payment ?? null, timeline: r.data.timeline,
      contingencies: r.data.contingencies || null, message: r.data.message || null,
      full_name: r.data.full_name, email: r.data.email, phone: r.data.phone,
    });
    setSubmitting(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setDone(true);
  };

  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-elevated">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <h3 className="mt-3 text-xl font-bold">Offer submitted!</h3>
            <p className="mt-2 text-sm text-muted-foreground">An agent will be in touch within 24 hours.</p>
            <Button className="mt-5 w-full" onClick={() => { setDone(false); onClose(); }}>Done</Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2"><FileSignature className="h-5 w-5 text-primary" /><h3 className="text-xl font-bold">Start an offer</h3></div>
                <p className="text-xs text-muted-foreground">{propertyTitle} · List price {fmt(listPrice)}</p>
              </div>
              <button onClick={onClose}><X className="h-5 w-5" /></button>
            </div>

            {/* Stepper */}
            <div className="mb-4 flex gap-1">
              {[1, 2, 3].map((n) => <div key={n} className={`h-1 flex-1 rounded-full ${step >= n ? "bg-primary" : "bg-border"}`} />)}
            </div>

            {step === 1 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Your offer</h4>
                <div>
                  <label className="text-xs text-muted-foreground">Offer amount (₦)</label>
                  <Input type="number" value={d.offer_amount} onChange={(e) => setD({ ...d, offer_amount: Number(e.target.value) })} />
                  <p className="mt-1 text-xs text-muted-foreground">{((d.offer_amount / listPrice - 1) * 100).toFixed(1)}% vs list price</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Financing</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={d.financing} onChange={(e) => setD({ ...d, financing: e.target.value as any })}>
                    <option value="cash">Cash</option>
                    <option value="mortgage">Mortgage</option>
                    <option value="installments">Installments</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {d.financing !== "cash" && (
                  <div>
                    <label className="text-xs text-muted-foreground">Down payment (₦)</label>
                    <Input type="number" value={d.down_payment} onChange={(e) => setD({ ...d, down_payment: Number(e.target.value) })} />
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Timeline & terms</h4>
                <div>
                  <label className="text-xs text-muted-foreground">Closing timeline</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={d.timeline} onChange={(e) => setD({ ...d, timeline: e.target.value })}>
                    {["Within 30 days", "Within 60 days", "Within 90 days", "Flexible"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <Textarea rows={3} placeholder="Contingencies (e.g. inspection, valuation)" value={d.contingencies}
                  onChange={(e) => setD({ ...d, contingencies: e.target.value })} />
                <Textarea rows={3} placeholder="Personal message to seller (optional)" value={d.message}
                  onChange={(e) => setD({ ...d, message: e.target.value })} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Your contact info</h4>
                <Input placeholder="Full name" value={d.full_name} onChange={(e) => setD({ ...d, full_name: e.target.value })} />
                <Input type="email" placeholder="Email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} />
                <Input placeholder="Phone (+234 ...)" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} />
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p><strong>Offer:</strong> {fmt(d.offer_amount)} ({d.financing})</p>
                  <p><strong>Timeline:</strong> {d.timeline}</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="flex-1">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)} className="flex-1">Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
              ) : (
                <Button onClick={submit} disabled={submitting} className="flex-1">{submitting ? "Submitting…" : "Submit offer"}</Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}