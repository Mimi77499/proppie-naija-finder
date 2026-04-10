import { Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Property } from "@/data/properties";

const statusColors: Record<string, string> = {
  hot: "bg-destructive text-destructive-foreground",
  new: "bg-primary text-primary-foreground",
  reduced: "bg-orange-500 text-white",
  featured: "bg-secondary text-secondary-foreground",
};

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/property/${property.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold ${statusColors[property.status]}`}>
          {property.statusLabel}
        </span>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <Share2 className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <Heart className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-lg font-bold text-foreground">{property.price}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
          <span>{property.sqft}</span>
        </div>
        <p className="mt-2 truncate text-sm text-foreground">{property.title}</p>
        <p className="text-sm text-muted-foreground">{property.location}, {property.city}</p>
      </div>
    </Link>
  );
}
