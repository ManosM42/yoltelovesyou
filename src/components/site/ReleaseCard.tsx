import { Reveal } from "./Reveal";
import type { Release } from "@/data/site";

export function ReleaseCard({ release, delay = 0 }: { release: Release; delay?: number }) {
  return (
    <Reveal delay={delay} className="group">
      <article className="hover-lift shine overflow-hidden rounded-xl border border-border/70 bg-card">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={release.cover}
            alt={`${release.title} cover art`}
            loading="lazy"
            width={800}
            height={800}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute top-3 left-3 rounded-full border border-chrome/40 bg-background/70 px-3 py-1 text-[10px] tracking-[0.2em] uppercase backdrop-blur">
            {release.type}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-2xl leading-none">{release.title}</h3>
          <p className="mt-2 text-xs text-muted-foreground">{release.date}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] tracking-[0.15em] uppercase">
            {(
              [
                ["Spotify", release.links.spotify],
                ["YouTube", release.links.youtube],
                ["Apple", release.links.apple],
              ] as const
            ).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="hover-glow rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}