import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const tabs = [
  { label: "Buy", value: "sale" },
  { label: "Rent", value: "rent" },
  { label: "Short Lease", value: "shortlet" },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("sale");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?type=${activeTab}&q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="relative flex min-h-[400px] items-center justify-center overflow-hidden md:min-h-[480px]">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-3 py-10 text-center sm:px-4 md:py-16">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          Find Your Perfect
          <span className="text-gradient-brand"> Property</span>
        </h1>
        <p className="mb-8 text-lg text-secondary-foreground/80">
          Discover premium homes for sale, rent, and short lease across Nigeria
        </p>

        {/* Tabs */}
        <div className="mb-4 inline-flex rounded-t-xl bg-background/10 p-1 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-secondary-foreground/90 hover:bg-background/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl flex-col overflow-hidden rounded-xl bg-background shadow-elevated sm:flex-row">
          <div className="flex flex-1 items-center gap-2 px-3 sm:px-4">
            <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter city, area, or neighborhood..."
              className="w-full border-0 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground sm:py-4"
            />
          </div>
          <button
            type="submit"
            className="m-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Lekki", "Ikoyi", "Victoria Island", "Ikeja", "Abuja"].map((area) => (
            <button
              key={area}
              onClick={() => { setSearchQuery(area); }}
              className="rounded-full border border-secondary-foreground/20 px-3 py-1 text-xs text-secondary-foreground/80 transition-colors hover:bg-secondary-foreground/10"
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
