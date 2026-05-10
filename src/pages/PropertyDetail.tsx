import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  MapPin, Bed, Bath, Maximize, Calendar,
  Phone, Mail, ChevronLeft, ChevronRight, Check, Home,
  Car, Sofa, FileText, Building, Navigation, CalendarCheck, FileSignature
} from "lucide-react";
import { properties } from "@/data/properties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyViewTabs from "@/components/PropertyViewTabs";
import SaveButton from "@/components/property/SaveButton";
import ShareButton from "@/components/property/ShareButton";
import RequestTourModal from "@/components/property/RequestTourModal";
import StartOfferModal from "@/components/property/StartOfferModal";
import MortgageEstimator from "@/components/property/MortgageEstimator";
import PriceHistory from "@/components/property/PriceHistory";
import { Button } from "@/components/ui/button";

export default function PropertyDetail() {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Property not found</h2>
            <Link to="/" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">Back to listings</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    hot: "bg-destructive text-destructive-foreground",
    new: "bg-primary text-primary-foreground",
    reduced: "bg-orange-500 text-white",
    featured: "bg-secondary text-secondary-foreground",
  };

  const similarProperties = properties
    .filter((p) => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-1.5 overflow-hidden text-xs text-muted-foreground sm:gap-2 sm:text-sm">
          <Link to="/" className="shrink-0 hover:text-foreground">Home</Link>
          <span className="shrink-0">/</span>
          <Link
            to={`/properties?type=${property.type}`}
            className="shrink-0 hover:text-foreground capitalize"
          >
            {property.type === "sale" ? "Buy" : property.type === "rent" ? "Rent" : "Short Lease"}
          </Link>
          <span className="shrink-0">/</span>
          <span className="truncate text-foreground">{property.title}</span>
        </div>

        {/* Image Gallery */}
        <div className="mb-6 overflow-hidden rounded-xl sm:mb-8 sm:rounded-2xl">
          <div className="relative aspect-[16/9] md:aspect-[2.2/1]">
            <img
              src={property.images[currentImage]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <span className={`absolute left-4 top-4 rounded-md px-3 py-1.5 text-sm font-semibold ${statusColors[property.status]}`}>
              {property.statusLabel}
            </span>

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

            <div className="absolute right-4 top-4 flex gap-2">
              <ShareButton title={property.title} />
              <SaveButton propertyId={property.id} />
            </div>

            <div className="absolute bottom-4 right-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {currentImage + 1} / {property.images.length}
            </div>
          </div>

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
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main info */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            {/* Title & Price */}
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">{property.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.location}, {property.city}, {property.state}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-primary sm:mt-3 sm:text-3xl">{property.price}</p>

              {/* Tour & Offer actions */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button onClick={() => setTourOpen(true)} variant="outline" className="w-full">
                  <CalendarCheck className="mr-1.5 h-4 w-4" /> Request a tour
                </Button>
                {property.type === "sale" && (
                  <Button onClick={() => setOfferOpen(true)} className="w-full">
                    <FileSignature className="mr-1.5 h-4 w-4" /> Start an offer
                  </Button>
                )}
              </div>

              {/* Mobile-only agent contact */}
              <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card lg:hidden">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {property.agent.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{property.agent.name}</p>
                    <p className="text-xs text-muted-foreground">PropPie Verified Agent</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <a
                    href={`mailto:${property.agent.email}?subject=Enquiry about ${property.title}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                  <a
                    href={`https://wa.me/${property.agent.phone.replace(/\s|\+/g, "")}?text=I'm interested in: ${property.title}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2.5 text-xs font-semibold text-secondary-foreground"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms || "N/A" },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms || "N/A" },
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

            {/* About */}
            <div>
              <h2 className="mb-3 text-xl font-semibold text-foreground">About This Property</h2>
              <p className="leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            {/* Property Details Grid */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Property Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { icon: Home, label: "Property Type", value: property.propertyType },
                  { icon: Building, label: "Listing Type", value: property.type === "sale" ? "For Sale" : property.type === "rent" ? "For Rent" : "Short Lease" },
                  { icon: Calendar, label: "Year Built", value: property.yearBuilt },
                  { icon: Maximize, label: "Size", value: property.sqft },
                  { icon: Car, label: "Parking", value: property.parking || "Available" },
                  { icon: Sofa, label: "Furnishing", value: property.furnishing || "Unfurnished" },
                  { icon: FileText, label: "Title Document", value: property.titleDocument || "Contact Agent" },
                  { icon: Navigation, label: "Service Charge", value: property.serviceCharge || "N/A" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="mb-3 text-xl font-semibold text-foreground">Features & Amenities</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {property.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 rounded-lg border border-border p-3">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighbourhood */}
            {property.neighborhood && (
              <div>
                <h2 className="mb-3 text-xl font-semibold text-foreground">About the Neighbourhood</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">{property.neighborhood}</p>
                {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">What's Nearby</h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {property.nearbyPlaces.map((place) => (
                        <div key={place} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{place}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Map, Street View & Floor Plan */}
            <PropertyViewTabs
              location={property.location}
              city={property.city}
              state={property.state}
              coordinates={property.coordinates}
              floorPlanImage={property.floorPlanImage}
            />

            {/* Price History */}
            <PriceHistory price={property.priceNumeric} status={property.status} yearBuilt={property.yearBuilt} />

            {/* Mortgage Estimator */}
            {property.type === "sale" && <MortgageEstimator price={property.priceNumeric} />}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Similar Properties</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {similarProperties.map((p) => (
                    <Link
                      key={p.id}
                      to={`/property/${p.id}`}
                      className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-card-hover"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-foreground">{p.price}</p>
                        <p className="mt-1 truncate text-sm text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.location}, {p.city}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Agent - desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
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

              {/* Quick summary card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold text-foreground">{property.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-foreground">{property.location}</span>
                  </div>
                  {property.serviceCharge && property.serviceCharge !== "N/A" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Charge</span>
                      <span className="font-medium text-foreground">{property.serviceCharge}</span>
                    </div>
                  )}
                  {property.titleDocument && property.titleDocument !== "N/A (Short Let)" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="font-medium text-foreground">{property.titleDocument}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
