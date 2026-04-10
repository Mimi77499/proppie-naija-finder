import { useSearchParams, Link } from "react-router-dom";
import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const typeLabels: Record<string, string> = {
  sale: "Properties for Sale",
  rent: "Properties for Rent",
  shortlet: "Short Lease Properties",
};

const propertyTypeLabels: Record<string, string> = {
  house: "Houses",
  apartment: "Apartments",
  land: "Land",
  commercial: "Commercial Properties",
  office: "Office Spaces",
  vacation: "Vacation Homes",
  serviced: "Serviced Apartments",
};

export default function PropertiesListing() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "sale";
  const propertyCategory = searchParams.get("property") || "";
  const status = searchParams.get("status") || "";
  const q = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    let result = properties;

    if (type) {
      result = result.filter((p) => p.type === type);
    }

    if (status) {
      result = result.filter((p) => p.status === status);
    }

    if (propertyCategory) {
      const categoryMap: Record<string, string[]> = {
        house: ["Detached Duplex", "Semi-Detached Duplex", "Detached House", "Bungalow", "Terrace", "Terrace Duplex", "Mansion"],
        apartment: ["Apartment", "Flat", "Penthouse", "Studio"],
        land: ["Land"],
        commercial: ["Commercial", "Shop", "Warehouse"],
        office: ["Office"],
        vacation: ["Villa", "Cottage"],
        serviced: ["Apartment"],
      };
      const types = categoryMap[propertyCategory] || [];
      if (types.length > 0) {
        result = result.filter((p) => types.some((t) => p.propertyType.includes(t)));
      }
    }

    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.location.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.state.toLowerCase().includes(query)
      );
    }

    return result;
  }, [type, propertyCategory, status, q]);

  const pageTitle = (() => {
    const parts: string[] = [];
    if (propertyCategory && propertyTypeLabels[propertyCategory]) {
      parts.push(propertyTypeLabels[propertyCategory]);
    }
    if (type && typeLabels[type]) {
      parts.push(typeLabels[type]);
    }
    if (status === "new") parts.push("— New Developments");
    if (q) parts.push(`in "${q}"`);
    return parts.join(" — ") || "All Properties";
  })();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">{pageTitle}</span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{pageTitle}</h1>
        <p className="mb-8 text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
            <p className="text-lg font-medium text-foreground">No properties found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search criteria</p>
            <Link to="/" className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Back to Home
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
