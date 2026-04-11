import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

const exploreCities = [
  {
    name: "Lagos",
    areas: ["Lekki", "Victoria Island", "Ikoyi", "Ikeja", "Ajah", "Surulere", "Yaba", "Magodo"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    count: 12,
  },
  {
    name: "Abuja",
    areas: ["Maitama", "Asokoro", "Wuse 2", "Jabi", "Garki", "Gwarinpa"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    count: 5,
  },
  {
    name: "Port Harcourt",
    areas: ["GRA", "Trans Amadi", "Rumuola", "Old GRA"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    count: 2,
  },
  {
    name: "Ibadan",
    areas: ["Bodija", "Jericho", "Ring Road", "Dugbe"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    count: 1,
  },
  {
    name: "Enugu",
    areas: ["Independence Layout", "New Haven", "Trans Ekulu", "GRA"],
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    count: 1,
  },
  {
    name: "Ogun State",
    areas: ["Abeokuta", "Ijebu-Ode", "Sagamu", "Ota"],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
    count: 1,
  },
];

export default function ExploreSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-4 sm:py-12 overflow-hidden">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Explore by Location</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Browse properties across Nigeria's top cities and neighbourhoods
      </p>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {exploreCities.map((city) => (
          <div
            key={city.name}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-card-hover"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={city.image}
                alt={city.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="flex items-center gap-1.5 text-lg font-bold text-secondary-foreground">
                  <MapPin className="h-4 w-4" />
                  {city.name}
                </h3>
                <p className="text-xs text-secondary-foreground/80">{city.count} properties listed</p>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {city.areas.map((area) => (
                  <Link
                    key={area}
                    to={`/properties?q=${encodeURIComponent(area)}&type=sale`}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {area}
                  </Link>
                ))}
              </div>
              <Link
                to={`/properties?q=${encodeURIComponent(city.name)}&type=sale`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all in {city.name} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
