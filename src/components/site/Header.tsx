import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { socials } from "@/data/site";

const nav = [
  { to: "/story", label: "Story" },
  { to: "/music", label: "Music" },
  { to: "/gallery", label: "Gallery" },
  { to: "/tour", label: "Tour" },
  { to: "/community", label: "Community" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="min-w-0 font-display text-2xl tracking-widest transition-transform duration-300 hover:scale-105"
          >
            <span className="text-violet-chrome">YOLTE LOVES YOU</span>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="group flex shrink-0 items-center gap-3 rounded-full border border-border/80 px-4 py-2 transition-all duration-300 hover:border-accent/70 hover:shadow-[var(--glow-accent)]"
          >
            <span className="hidden text-[10px] tracking-[0.3em] text-muted-foreground uppercase transition-colors group-hover:text-foreground sm:inline">
              {open ? "Close" : "Menu"}
            </span>
            <span className="relative flex h-4 w-6 flex-col justify-between">
              <span
                className={`h-[2px] w-full origin-center bg-foreground transition-transform duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[2px] w-full bg-foreground transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-[2px] w-full origin-center bg-foreground transition-transform duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 grain transition-all duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "var(--gradient-violet)" }}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-10 px-5 pt-24 pb-10">
          <nav className="flex flex-col">
            {nav.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-accent" }}
                style={{ transitionDelay: `${open ? 80 + i * 60 : 0}ms` }}
                className={`group flex items-center justify-between border-b border-border/40 py-4 font-display text-[13vw] leading-none tracking-wide transition-all duration-500 hover:pl-4 hover:text-accent sm:text-6xl ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                {item.label}
                <ArrowUpRight className="size-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:size-8" />
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}