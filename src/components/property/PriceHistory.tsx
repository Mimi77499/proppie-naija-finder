import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function PriceHistory({ price, status, yearBuilt }: { price: number; status: string; yearBuilt: string }) {
  // Synthesize a realistic price history. In production this would come from the database.
  const today = new Date();
  const events = [
    { date: today, label: "Listed for sale", price, change: status === "reduced" ? -8 : 0 },
    { date: addMonths(today, -2), label: "Price changed", price: status === "reduced" ? Math.round(price * 1.08) : price },
    { date: addMonths(today, -6), label: "Listed for sale", price: status === "reduced" ? Math.round(price * 1.08) : price },
    { date: new Date(`${yearBuilt}-06-01`), label: "Built", price: Math.round(price * 0.55) },
  ];

  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
      <h2 className="mb-4 text-xl font-semibold">Price history</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2">Date</th>
              <th className="pb-2">Event</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => {
              const prev = events[i + 1]?.price;
              const diff = prev ? ((e.price - prev) / prev) * 100 : 0;
              const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
              const color = diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : "text-muted-foreground";
              return (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-muted-foreground">{e.date.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}</td>
                  <td className="py-3 font-medium">{e.label}</td>
                  <td className="py-3 text-right font-semibold">{fmt(e.price)}</td>
                  <td className={`py-3 text-right ${color}`}>
                    <span className="inline-flex items-center gap-1"><Icon className="h-3.5 w-3.5" />{prev ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%` : "—"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function addMonths(d: Date, m: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + m);
  return x;
}