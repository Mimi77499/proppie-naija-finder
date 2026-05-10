import { useState } from "react";
import { Share2, Copy, MessageCircle, Mail, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShareButton({ title, className }: { title: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `Check out this property on PropPie: ${title}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied!" });
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className={className || "flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"}>
        <Share2 className="h-5 w-5 text-foreground" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Share this property</h3>
              <button onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2">
              <button onClick={copy} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left text-sm hover:bg-muted">
                <Copy className="h-4 w-4 text-primary" /> Copy link
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`} target="_blank" rel="noopener"
                className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left text-sm hover:bg-muted">
                <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp
              </a>
              <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left text-sm hover:bg-muted">
                <Mail className="h-4 w-4 text-primary" /> Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}