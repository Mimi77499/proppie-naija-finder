import { useState, useMemo } from "react";
import PropertyCard from "./PropertyCard";
import { properties } from "@/data/properties";

const filterTabs = [
  { label: "All Properties", value: "all" },
  { label: "For Sale", value: "sale" },
  { label: "For Rent", value: "rent" },
  { label: "Short Lease", value: "shortlet" },
  { label: "Hot Deals", value: "hot" },
  { label: "Newly Listed", value: "new" },
  { label: "Price Reduced", value: "reduced" },
];

export default function PropertyFeed({ searchType, searchQuery }: { searchType?: string; searchQuery?: string }) {
  const [activeFilter, setActiveFilter] = useState(searchType || "all");

  const filtered = useMemo(() => {
    let result = properties;

    if (activeFilter === "hot" || activeFilter === "new" || activeFilter === "reduced") {
      result = result.filter((p) => p.status === activeFilter);
    } else if (activeFilter !== "all") {
      result = result.filter((p) => p.type === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  return (
    <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10">
      <h2 className="mb-1 text-2xl font-bold text-foreground">Property Feed</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        The most viewed and favourited homes across Nigeria
      </p>

      {/* Filter tabs */}
      <div className="mb-6 -mx-3 px-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:mx-0 sm:px-0 sm:mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
              activeFilter === tab.value
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "border border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-foreground">No properties found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </section>
  );
}
