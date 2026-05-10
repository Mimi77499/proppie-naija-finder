import { Link } from "react-router-dom";
import { Briefcase, ArrowRight } from "lucide-react";

export default function AgentCTABanner() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-secondary/80 p-8 shadow-elevated md:p-12">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Briefcase className="h-3 w-3" /> For Agents
            </span>
            <h2 className="mt-3 text-2xl font-bold text-secondary-foreground sm:text-3xl md:text-4xl">
              Grow your real estate business with PropPie
            </h2>
            <p className="mt-3 text-sm text-secondary-foreground/80 sm:text-base">
              Reach thousands of qualified buyers and renters across Nigeria. List unlimited properties, manage tours, and close deals — all in one place.
            </p>
            <Link to="/become-agent"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Become an Agent <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { n: "10K+", l: "Active buyers" },
              { n: "₦8B+", l: "Closed in 2024" },
              { n: "1.2K", l: "Verified agents" },
            ].map(({ n, l }) => (
              <div key={l} className="rounded-2xl bg-secondary-foreground/5 p-4 backdrop-blur">
                <p className="text-xl font-bold text-primary sm:text-2xl">{n}</p>
                <p className="mt-1 text-xs text-secondary-foreground/70">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}