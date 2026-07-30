import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { releases, Release, Track } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { X, Play, Music, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Δισκογραφία Yolte — Singles, EPs & Albums" },
      {
        name: "description",
        content: "Όλα τα releases του Yolte με links σε Spotify, YouTube και Apple Music.",
      },
      { property: "og:title", content: "Δισκογραφία Yolte" },
      { property: "og:description", content: "Κάθε single, EP, album και feature σε ένα μέρος." },
    ],
  }),
  component: MusicPage,
});

const types = ["Όλα", "Single", "EP", "Album", "Feature"] as const;

function MusicPage() {
  const [type, setType] = useState<(typeof types)[number]>("Όλα");
  const [year, setYear] = useState<"Όλα" | number>("Όλα");
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  // Ταξινόμηση χρονολογικά (πιο πρόσφατα πάνω)
  const sortedReleases = useMemo(() => {
    return [...releases].sort((a, b) => b.year - a.year);
  }, []);

  const years = useMemo(
    () => Array.from(new Set(sortedReleases.map((r) => r.year))).sort((a, b) => b - a),
    [sortedReleases],
  );

  const filtered = sortedReleases.filter(
    (r) => (type === "Όλα" || r.type === type) && (year === "Όλα" || r.year === year),
  );

  const chip = (active: boolean) =>
    `hover-glow rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all ${
      active
        ? "border-accent text-accent shadow-[0_0_15px_rgba(168,85,247,0.4)] bg-accent/5"
        : "border-border text-muted-foreground hover:text-foreground"
    }`;

  // Helper για τη δημιουργία Spotify link αναζήτησης/τραγουδιού ανά track
  const getTrackSpotifyUrl = (releaseTitle: string, trackTitle: string, mainSpotifyLink: string) => {
    // Αν υπάρχει custom link στο release ή μπορούμε να φτιάξουμε query αναζήτησης στο Spotify
    const query = encodeURIComponent(`Yolte ${trackTitle} ${releaseTitle}`);
    return `https://open.spotify.com/search/${query}`;
  };

  return (
    <div className="min-h-screen">
      {/* ==================== INFINITE MARQUEE ==================== */}
      <div className="relative w-full overflow-hidden bg-accent text-accent-foreground py-2.5 text-xs font-bold uppercase tracking-[0.25em] shadow-lg flex select-none">
        <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-12 whitespace-nowrap">
          <span>🔥 YOLTE DISCOGRAPHY</span>
          <span>•</span>
          <span>STREAM NOW ON SPOTIFY & APPLE MUSIC</span>
          <span>•</span>
          <span>NEW RELEASES OUT NOW</span>
          <span>•</span>
        </div>
        <div aria-hidden="true" className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-12 whitespace-nowrap">
          <span>🔥 YOLTE DISCOGRAPHY</span>
          <span>•</span>
          <span>STREAM NOW ON SPOTIFY & APPLE MUSIC</span>
          <span>•</span>
          <span>NEW RELEASES OUT NOW</span>
          <span>•</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <p className="text-xs tracking-[0.35em] text-accent uppercase font-bold">Discography</p>
          <h1 className="mt-4 text-6xl leading-[0.9] sm:text-8xl">
            <span className="text-violet-chrome">Η Μουσική</span>
          </h1>
        </Reveal>

        <div className="mt-12 space-y-4">
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)} className={chip(type === t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setYear("Όλα")} className={chip(year === "Όλα")}>
              Όλες οι χρονιές
            </button>
            {years.map((y) => (
              <button key={y} onClick={() => setYear(y)} className={chip(year === y)}>
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Releases Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <Reveal key={r.id} delay={i * 50}>
              <div 
                onClick={() => setSelectedRelease(r)}
                className="group cursor-pointer space-y-4 rounded-2xl border border-border/50 bg-card/30 p-4 transition-all hover:border-accent/50 hover:bg-card/50"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <img
                    src={r.cover}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full bg-accent p-3 text-white shadow-lg">
                      <Music className="size-6" />
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-accent font-bold">{r.type}</p>
                    <p className="text-[10px] text-muted-foreground">{r.year}</p>
                  </div>
                  <h3 className="mt-1 text-xl font-bold group-hover:text-accent transition-colors">{r.title}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-20 text-center text-sm text-muted-foreground italic">
            Δεν βρέθηκαν κυκλοφορίες με αυτά τα φίλτρα.
          </p>
        )}
      </div>

      {/* ==================== TRACKLIST MODAL ==================== */}
      {selectedRelease && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-card p-8 shadow-2xl">
            <button 
              onClick={() => setSelectedRelease(null)}
              className="absolute right-6 top-6 rounded-full bg-muted p-2 hover:bg-accent hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 shrink-0">
                <img src={selectedRelease.cover} alt={selectedRelease.title} className="rounded-xl shadow-lg w-full aspect-square object-cover" />
                <div className="mt-6 flex flex-col gap-2">
                  <a href={selectedRelease.links.spotify} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#1DB954] py-2.5 text-xs font-bold text-black hover:opacity-90">
                    Spotify Album
                  </a>
                  <a href={selectedRelease.links.youtube} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#FF0000] py-2.5 text-xs font-bold text-white hover:opacity-90">
                    YouTube
                  </a>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xs text-accent uppercase tracking-widest font-bold">{selectedRelease.type} • {selectedRelease.year}</p>
                <h2 className="mt-2 text-3xl font-bold">{selectedRelease.title}</h2>
                
                <div className="mt-8 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-2 flex items-center justify-between">
                    <span>Tracklist</span>
                    <span className="text-[10px] lowercase text-muted-foreground">κλικ σε τραγούδι για Spotify</span>
                  </h4>
                  {selectedRelease.tracks && selectedRelease.tracks.length > 0 ? (
                    <ol className="space-y-3">
                      {selectedRelease.tracks.map((track: Track, idx: number) => {
                        const trackUrl = getTrackSpotifyUrl(selectedRelease.title, track.title, selectedRelease.links.spotify);
                        return (
                          <li key={idx}>
                            <a 
                              href={trackUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between group/track rounded-lg p-2 transition-colors hover:bg-accent/10"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-muted-foreground">{idx + 1}.</span>
                                <div>
                                  <p className="text-sm font-medium group-hover/track:text-accent transition-colors flex items-center gap-1.5">
                                    {track.title}
                                    <ExternalLink className="size-3 opacity-0 group-hover/track:opacity-100 transition-opacity text-accent" />
                                  </p>
                                  {track.feat && track.feat.length > 0 && (
                                    <p className="text-[10px] text-muted-foreground">
                                      feat. <span className="text-accent/80">{track.feat.join(", ")}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Play className="size-3 text-muted-foreground opacity-0 group-hover/track:opacity-100 transition-opacity text-accent" />
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Single track release.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}