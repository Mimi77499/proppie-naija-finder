import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

export default function MortgageEstimator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(30);
  const [rate, setRate] = useState(18); // Nigerian mortgage rates ~15-22%
  const [term, setTerm] = useState(20);

  const { downPayment, principal, monthly, total, interest } = useMemo(() => {
    const dp = price * (downPct / 100);
    const p = price - dp;
    const r = rate / 100 / 12;
    const n = term * 12;
    const m = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const t = m * n;
    return { downPayment: dp, principal: p, monthly: m, total: t, interest: t - p };
  }, [price, downPct, rate, term]);

  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Payment estimator</h2>
      </div>

      <div className="mb-5 rounded-xl bg-primary/10 p-5 text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated monthly payment</p>
        <p className="mt-1 text-3xl font-bold text-foreground">{fmt(monthly)}</p>
        <p className="mt-1 text-xs text-muted-foreground">Principal & interest only</p>
      </div>

      <div className="space-y-4">
        <Slider label="Down payment" value={`${downPct}% (${fmt(downPayment)})`}
          input={<input type="range" min={10} max={80} step={5} value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-primary" />} />
        <Slider label="Interest rate" value={`${rate}%`}
          input={<input type="range" min={5} max={30} step={0.5} value={rate}
            onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary" />} />
        <Slider label="Loan term" value={`${term} years`}
          input={<input type="range" min={5} max={30} step={1} value={term}
            onChange={(e) => setTerm(Number(e.target.value))} className="w-full accent-primary" />} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <Stat label="Loan amount" value={fmt(principal)} />
        <Stat label="Total interest" value={fmt(interest)} />
        <Stat label="Total paid" value={fmt(total + downPayment)} />
        <Stat label="Down payment" value={fmt(downPayment)} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Estimate only. Actual rates and terms vary by lender.</p>
    </div>
  );
}

function Slider({ label, value, input }: { label: string; value: string; input: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      {input}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}