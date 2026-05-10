import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, CheckCircle2, ChevronRight, ChevronLeft, MapPin, User, FileText } from "lucide-react";

const NIGERIAN_AREAS = [
  "Lekki", "Ikoyi", "Victoria Island", "Ikeja", "Ajah", "Yaba", "Surulere",
  "Magodo", "Gbagada", "Maryland", "Lagos Island", "Apapa",
  "Abuja - Maitama", "Abuja - Asokoro", "Abuja - Wuse", "Abuja - Gwarinpa",
  "Port Harcourt", "Ibadan", "Kano", "Enugu", "Calabar", "Uyo",
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Full name required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(10, "Phone number required").max(20),
  agency_name: z.string().trim().max(120).optional().or(z.literal("")),
  license_number: z.string().trim().max(120).optional().or(z.literal("")),
  years_experience: z.coerce.number().int().min(0).max(60).optional(),
  bio: z.string().trim().min(40, "Tell us at least a bit about yourself (40+ chars)").max(1000),
  service_areas: z.array(z.string()).min(1, "Pick at least one area"),
});

type FormData = z.infer<typeof schema>;

export default function BecomeAgent() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<any>(null);

  const [data, setData] = useState<FormData>({
    full_name: "", email: user?.email || "", phone: "",
    agency_name: "", license_number: "", years_experience: 0,
    bio: "", service_areas: [],
  });

  useEffect(() => {
    if (user) {
      setData((d) => ({ ...d, email: user.email || d.email }));
      supabase.from("agent_applications").select("*").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => { if (data) setExisting(data); });
    }
  }, [user]);

  const toggleArea = (a: string) => {
    setData((d) => ({
      ...d,
      service_areas: d.service_areas.includes(a)
        ? d.service_areas.filter((x) => x !== a) : [...d.service_areas, a],
    }));
  };

  const next = () => {
    if (step === 1) {
      const r = schema.pick({ full_name: true, email: true, phone: true }).safeParse(data);
      if (!r.success) return toast({ title: "Check your details", description: r.error.errors[0].message, variant: "destructive" });
    }
    if (step === 2) {
      const r = schema.pick({ bio: true }).safeParse(data);
      if (!r.success) return toast({ title: "Bio too short", description: r.error.errors[0].message, variant: "destructive" });
    }
    if (step === 3) {
      if (data.service_areas.length === 0)
        return toast({ title: "Pick at least one area", variant: "destructive" });
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse(data);
    if (!parsed.success) return toast({ title: "Check your application", description: parsed.error.errors[0].message, variant: "destructive" });
    setSubmitting(true);
    const p = parsed.data;
    const { error } = await supabase.from("agent_applications").insert({
      user_id: user.id,
      full_name: p.full_name,
      email: p.email,
      phone: p.phone,
      agency_name: p.agency_name || null,
      license_number: p.license_number || null,
      years_experience: p.years_experience ?? null,
      bio: p.bio,
      service_areas: p.service_areas,
    });
    setSubmitting(false);
    if (error) return toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    setSubmitted(true);
    toast({ title: "Application submitted!", description: "We'll review it and get back to you shortly." });
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Become a PropPie Agent</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in or create an account to start your application.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild><Link to="/auth">Login or Create Account</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted || existing) {
    const status = existing?.status || "pending";
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 text-center">
          {status === "approved" ? (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              <h1 className="mt-4 text-2xl font-bold">You're an approved agent!</h1>
              <p className="mt-2 text-sm text-muted-foreground">Check your email for login instructions.</p>
            </>
          ) : status === "rejected" ? (
            <>
              <h1 className="mt-4 text-2xl font-bold text-destructive">Application not approved</h1>
              <p className="mt-2 text-sm text-muted-foreground">{existing?.rejection_reason || "Please contact support for more info."}</p>
            </>
          ) : (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              <h1 className="mt-4 text-2xl font-bold">Application submitted</h1>
              <p className="mt-2 text-sm text-muted-foreground">Our team will review your application within 1–3 business days.</p>
            </>
          )}
          <Button asChild className="mt-6"><Link to="/">Back to home</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const stepInfo = [
    { n: 1, title: "Personal", icon: User },
    { n: 2, title: "Professional", icon: FileText },
    { n: 3, title: "Coverage", icon: MapPin },
    { n: 4, title: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="text-center">
          <Briefcase className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Become a PropPie Agent</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join Nigeria's most trusted property platform.</p>
        </div>

        {/* Stepper */}
        <ol className="mt-8 flex items-center justify-between">
          {stepInfo.map(({ n, title, icon: Icon }, i) => (
            <li key={n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                  step >= n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{title}</span>
              </div>
              {i < stepInfo.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${step > n ? "bg-primary" : "bg-border"}`} />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Personal information</h2>
              <div>
                <label className="text-sm font-medium">Full name</label>
                <Input value={data.full_name} onChange={(e) => setData({ ...data, full_name: e.target.value })} placeholder="Adebayo Johnson" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone (with country code)</label>
                <Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+234 803 000 0000" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Professional background</h2>
              <div>
                <label className="text-sm font-medium">Agency name (optional)</label>
                <Input value={data.agency_name} onChange={(e) => setData({ ...data, agency_name: e.target.value })} placeholder="e.g. PropPie Realty" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">License # (optional)</label>
                  <Input value={data.license_number} onChange={(e) => setData({ ...data, license_number: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Years experience</label>
                  <Input type="number" min={0} max={60} value={data.years_experience}
                    onChange={(e) => setData({ ...data, years_experience: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Short bio</label>
                <Textarea rows={5} value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })}
                  placeholder="Tell us about your experience selling/letting property in Nigeria..." />
                <p className="mt-1 text-xs text-muted-foreground">{data.bio.length}/1000 characters</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Service areas</h2>
              <p className="text-sm text-muted-foreground">Select all the areas you cover.</p>
              <div className="flex flex-wrap gap-2">
                {NIGERIAN_AREAS.map((a) => {
                  const active = data.service_areas.includes(a);
                  return (
                    <button key={a} type="button" onClick={() => toggleArea(a)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"
                      }`}>{a}</button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Review & submit</h2>
              <dl className="space-y-3 text-sm">
                <Row label="Name" value={data.full_name} />
                <Row label="Email" value={data.email} />
                <Row label="Phone" value={data.phone} />
                <Row label="Agency" value={data.agency_name || "—"} />
                <Row label="License" value={data.license_number || "—"} />
                <Row label="Experience" value={`${data.years_experience || 0} year(s)`} />
                <Row label="Areas" value={data.service_areas.join(", ") || "—"} />
              </dl>
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                By submitting, you agree to our agent terms. We'll review your application within 1–3 business days. Once approved you'll receive an email with your temporary login password.
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-3">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={next}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
            ) : (
              <Button onClick={submit} disabled={submitting}>{submitting ? "Submitting…" : "Submit application"}</Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}