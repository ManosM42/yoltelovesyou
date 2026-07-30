import { Link } from "@tanstack/react-router";
import { socials } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-[var(--gradient-violet)]">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-5xl tracking-widest">
              <span className="text-violet-chrome">YOLTE</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Από το δωμάτιο στη σκηνή. Day 1 → Σήμερα, χωρίς φίλτρα.
            </p>
          </div>
          <div>
            <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase">Follow</p>
            <ul className="space-y-2 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-sweep text-muted-foreground transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs tracking-[0.3em] text-accent uppercase">Booking</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:booking@yolte.gr" className="underline-sweep transition-colors hover:text-accent">
                  booking@yolte.gr
                </a>
              </li>
              <li>
                <a href="mailto:press@yolte.gr" className="underline-sweep transition-colors hover:text-accent">
                  press@yolte.gr
                </a>
              </li>
              <li>
                <Link to="/tour" className="underline-sweep transition-colors hover:text-accent">
                  Tour dates
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hairline mt-12" />
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Yolte. All rights reserved.
        </p>
      </div>
    </footer>
  );
}