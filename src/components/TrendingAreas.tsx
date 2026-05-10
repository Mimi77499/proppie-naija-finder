import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const areas = [
  { name: "Lekki", city: "Lagos", img: "https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?w=600&q=80", count: "1,240+" },
  { name: "Ikoyi", city: "Lagos", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80", count: "680+" },
  { name: "Victoria Island", city: "Lagos", img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80", count: "910+" },
  { name: "Maitama", city: "Abuja", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", count: "520+" },
  { name: "Asokoro", city: "Abuja", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", count: "340+" },
  { name: "Port Harcourt", city: "Rivers", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80", count: "420+" },
];

export default function TrendingAreas() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <TrendingUp className="h-6 w-6 text-primary" /> Trending areas in Nigeria
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Most searched neighbourhoods this week</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <Link key={a.name} to={`/?q=${encodeURIComponent(a.name)}`}
            className="group relative h-48 overflow-hidden rounded-2xl shadow-card transition-all hover:shadow-card-hover">
            <img src={a.img} alt={a.name} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="text-xs uppercase tracking-wide opacity-80">{a.city}</p>
              <h3 className="text-xl font-bold">{a.name}</h3>
              <p className="text-xs opacity-90">{a.count} listings</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}