import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/proppie-logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <img src={logo} alt="PropPie" className="mb-4 h-8 brightness-0 invert" />
            <p className="text-sm text-secondary-foreground/70">
              Simplifying property management, built to grow with your portfolio.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary-foreground/50">Properties</h4>
            <div className="space-y-2 text-sm">
              <Link to="/properties?type=sale" className="block text-secondary-foreground/70 hover:text-secondary-foreground">Buy</Link>
              <Link to="/properties?type=rent" className="block text-secondary-foreground/70 hover:text-secondary-foreground">Rent</Link>
              <Link to="/properties?type=shortlet" className="block text-secondary-foreground/70 hover:text-secondary-foreground">Short Lease</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary-foreground/50">Company</h4>
            <div className="space-y-2 text-sm">
              <a href="https://www.proppie.net/" target="_blank" rel="noopener" className="block text-secondary-foreground/70 hover:text-secondary-foreground">About PropPie</a>
              <a href="https://www.proppie.net/contact" target="_blank" rel="noopener" className="block text-secondary-foreground/70 hover:text-secondary-foreground">Contact</a>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary-foreground/50">Contact</h4>
            <div className="space-y-2 text-sm text-secondary-foreground/70">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@proppie.net</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +234 703 135 8061</p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-secondary-foreground/10 pt-6 text-center text-xs text-secondary-foreground/50">
          © {new Date().getFullYear()} PropPie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
