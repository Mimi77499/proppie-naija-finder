import { useState } from "react";

interface PropertyViewTabsProps {
  location: string;
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number };
  floorPlanImage?: string;
}

type ViewTab = "map" | "street" | "floor";

export default function PropertyViewTabs({ location, city, state, coordinates, floorPlanImage }: PropertyViewTabsProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("map");

  const lat = coordinates?.lat;
  const lng = coordinates?.lng;
  const fullAddress = encodeURIComponent(`${location}, ${city}, ${state}, Nigeria`);

  // Use coordinates for accuracy when available, fallback to address search
  const mapSrc = lat && lng
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
    : `https://maps.google.com/maps?q=${fullAddress}&z=15&output=embed`;

  const streetSrc = lat && lng
    ? `https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1sstXGrAKxF_UcW!2m2!1d${lat}!2d${lng}!3f0!4f0!5f0.7820865974627469&layer=c`
    : `https://www.google.com/maps?q=${fullAddress}&layer=c&output=embed`;

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: "map", label: "Map View", icon: <MapIcon className="h-4 w-4" /> },
    { id: "street", label: "Street View", icon: <StreetIcon className="h-4 w-4" /> },
    { id: "floor", label: "Floor Plan", icon: <FloorIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {/* Tab buttons */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="relative aspect-[16/9] sm:aspect-[2/1] bg-muted">
        {activeTab === "map" && (
          <iframe
            title="Property Map"
            src={mapSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        )}

        {activeTab === "street" && (
          <div className="h-full w-full relative">
            <iframe
              title="Street View"
              src={streetSrc}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Link to open full street view in Google Maps */}
            {lat && lng && (
              <a
                href={`https://www.google.com/maps/@${lat},${lng},3a,75y,90t/data=!3m6!1e1!3m4!1s0x0:0x0!2e0!7i13312!8i6656`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow backdrop-blur-sm hover:bg-background transition-colors"
              >
                Open in Google Maps ↗
              </a>
            )}
          </div>
        )}

        {activeTab === "floor" && (
          <>
            {floorPlanImage ? (
              <img
                src={floorPlanImage}
                alt="Floor Plan"
                className="h-full w-full object-contain bg-white p-2"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                <FloorIcon className="h-12 w-12 text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium text-foreground">Floor Plan</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Floor plan for this property is not yet available. Contact the agent for details.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  );
}

function StreetIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

function FloorIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 3v18" />
    </svg>
  );
}
