import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, Search, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/proppie-logo.png";

const navDropdowns = {
  Buy: [
    { label: "Houses for Sale", href: "/?type=sale&property=house" },
    { label: "Apartments for Sale", href: "/?type=sale&property=apartment" },
    { label: "Land for Sale", href: "/?type=sale&property=land" },
    { label: "Commercial Properties", href: "/?type=sale&property=commercial" },
    { label: "New Developments", href: "/?type=sale&status=new" },
  ],
  Sell: [
    { label: "List Your Property", href: "/?action=list" },
    { label: "Get a Valuation", href: "/?action=valuation" },
    { label: "Selling Guide", href: "/?action=guide" },
  ],
  Rent: [
    { label: "Houses for Rent", href: "/?type=rent&property=house" },
    { label: "Apartments for Rent", href: "/?type=rent&property=apartment" },
    { label: "Office Spaces", href: "/?type=rent&property=office" },
    { label: "Shops & Warehouses", href: "/?type=rent&property=commercial" },
  ],
  "Short Lease": [
    { label: "Shortlet Apartments", href: "/?type=shortlet&property=apartment" },
    { label: "Vacation Homes", href: "/?type=shortlet&property=vacation" },
    { label: "Serviced Apartments", href: "/?type=shortlet&property=serviced" },
  ],
};

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.key !== "default";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Back button + Logo */}
        <div className="flex items-center gap-3">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-muted"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          )}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="PropPie" className="h-8 object-contain" />
          </Link>
        </div>

        {/* Center: Nav dropdowns (desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {Object.entries(navDropdowns).map(([label, items]) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                {label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {openDropdown === label && (
                <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-border bg-popover p-1.5 shadow-elevated animate-in fade-in slide-in-from-top-2">
                  {items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block rounded-md px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            Feed
          </Link>
        </nav>

        {/* Right: CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+2347031358061" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <Phone className="h-4 w-4" />
            +234 703 135 8061
          </a>
          <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Join / Sign in
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          {Object.entries(navDropdowns).map(([label, items]) => (
            <div key={label} className="mb-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              {items.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="mt-4 border-t border-border pt-4">
            <a href="tel:+2347031358061" className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" /> +234 703 135 8061
            </a>
            <Button className="w-full bg-secondary text-secondary-foreground">Join / Sign in</Button>
          </div>
        </div>
      )}
    </header>
  );
}
