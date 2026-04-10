import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Share2, MapPin, Bed, Bath, Maximize, Calendar, Phone, Mail, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { properties } from "@/data/properties";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PropertyDetail() {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id);
  const [currentImage, setCurrentImage] = useState(0);

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Property not found</h2>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">Back to listings</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    hot: "bg-destructive text-destructive-foreground",
    new: "bg-primary text-primary-foreground",
    reduced: "bg-orange-500 text-background",
    featured: "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="capitalize">{property.type === "sale" ? "Buy" : property.type === "rent" ? "Rent" : "Short Lease"}</span>
          <span>/</span>
          <span className="text-foreground">{property.title}</span>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/9] md:aspect-[2.2/1]">
            <img
              src={property.images[currentImage]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <span className={`absolute left-4 top-4 rounded-md px-3 py-1.5 text-sm font-semibold ${statusColors[property.status]}`}>
              {property.statusLabel}
            </span>

            {/* Nav arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Share / favorite */}
            <div className="absolute right-4 top-4 flex gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                <Share2 className="h-5 w-5 text-foreground" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                <Heart className="h-5 w-5 text-foreground" />
              </button>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {currentImage + 1} / {property.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === currentImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{property.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.location}, {property.city}, {property.state}</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-primary">{property.price}</p>
            </div>

            {/* Quick stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Maximize, label: "Size", value: property.sqft },
                { icon: Calendar, label: "Year Built", value: property.yearBuilt },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4 text-center shadow-card">
                  <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-lg font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-foreground">About This Property</h2>
              <p className="leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-foreground">Features & Amenities</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 rounded-lg border border-border p-3">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property type */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-3 text-xl font-semibold text-foreground">Property Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Property Type:</span> <span className="font-medium text-foreground">{property.propertyType}</span></div>
                <div><span className="text-muted-foreground">Listing Type:</span> <span className="font-medium capitalize text-foreground">{property.type === "sale" ? "For Sale" : property.type === "rent" ? "For Rent" : "Short Lease"}</span></div>
                <div><span className="text-muted-foreground">Year Built:</span> <span className="font-medium text-foreground">{property.yearBuilt}</span></div>
                <div><span className="text-muted-foreground">Size:</span> <span className="font-medium text-foreground">{property.sqft}</span></div>
              </div>
            </div>
          </div>

          {/* Sidebar: Agent */}
          <div>
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Agent</h3>
              <div className="mb-4">
                <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {property.agent.name[0]}
                </div>
                <p className="mt-2 font-medium text-foreground">{property.agent.name}</p>
                <p className="text-sm text-muted-foreground">PropPie Verified Agent</p>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Phone className="h-4 w-4" /> Call Agent
                </a>
                <a
                  href={`mailto:${property.agent.email}?subject=Enquiry about ${property.title}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <Mail className="h-4 w-4" /> Send Email
                </a>
                <a
                  href={`https://wa.me/${property.agent.phone.replace(/\s|\+/g, "")}?text=I'm interested in: ${property.title}`}
                  target="_blank"
                  rel="noopener"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
