import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowDown, ArrowUpRight, CalendarOff } from "lucide-react";
import hero from "@/assets/hero-yolte.jpg";
import gallery4 from "@/assets/gallery-3.jpg";
import { releases, timeline } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ReleaseCard } from "@/components/site/ReleaseCard";
import { Newsletter } from "@/components/site/Newsletter";
import { useParallax } from "@/components/site/Parallax";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yolte — Επίσημη ιστοσελίδα | Greek Rap" },
      {
        name: "description",
        content:
          "Το επίσημο site του Yolte: η ιστορία από day 1 μέχρι σήμερα, δισκογραφία, tour dates και fan community.",
      },
      { property: "og:title", content: "Yolte — Επίσημη ιστοσελίδα" },
      {
        property: "og:description",
        content: "Μουσική, ιστορία, live shows και community. Day 1 → Σήμερα.",
      },
    ],
  }),
  component: Index,
});

type Show = {
  id: string;
  city: string;
  venue: string;
  event_date: string;
  ticket_url?: string;
  status: "tickets" | "soldout" | "cancelled";
};

function Index() {
  const heroParallax = useParallax<HTMLDivElement>(0.35);
  const copyParallax = useParallax<HTMLDivElement>(-0.12);
  const showsParallax = useParallax<HTMLDivElement>(0.2);

  const [dbShows, setDbShows] = useState<Show[]>([]);
  const [loadingShows, setLoadingShows] = useState(true);

  useEffect(() => {
    async function fetchLiveShows() {
      try {
        const { data, error } = await supabase
          .from("shows")
          .select("*")
          .order("event_date", { ascending: true })
          .limit(3);

        if (!error && data) {
          setDbShows(data);
        }
      } catch (err) {
        console.error("Failed to load shows", err);
      } finally {
        setLoadingShows(false);
      }
    }

    fetchLiveShows();
  }, []);

  return (
    <>
      <section className="grain relative -mt-16 flex min-h-[100svh] items-end overflow-hidden">
        <div ref={heroParallax.ref} className="absolute inset-0">
          <img
            src={hero}
            alt="Yolte portrait at night"
            width={1280}
            height={1600}
            style={{ transform: `translate3d(0, ${heroParallax.offset}px, 0) scale(1.2)` }}
            className="size-full object-cover object-top brightness-125 contrast-110 will-change-transform"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div
          className="absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
          style={{ background: "var(--primary)" }}
        />
        <div ref={copyParallax.ref} className="relative mx-auto w-full max-w-7xl px-5 pb-24">
          <div style={{ transform: `translate3d(0, ${copyParallax.offset}px, 0)` }}>
            <Reveal>
              <p className="text-xs tracking-[0.4em] text-accent uppercase">Athens · Greek Rap</p>
              <h1 className="mt-4 text-[19vw] leading-[0.8] sm:text-[13rem]">
                <span className="text-violet-chrome">YOLTE</span>
              </h1>
              <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
                Από το δωμάτιο στη σκηνή. Χωρίς label, χωρίς φίλτρα — μόνο ό,τι είναι αληθινό.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/music"
                  className="hover-glow shine rounded-full bg-primary px-7 py-3 text-xs tracking-[0.2em] text-primary-foreground uppercase"
                >
                  Άκου τώρα
                </Link>
                <Link
                  to="/story"
                  className="hover-glow shine rounded-full border border-chrome/50 px-7 py-3 text-xs tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent"
                >
                  Day 1 → Σήμερα
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="mt-16 flex items-center gap-3 text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            <ArrowDown className="size-4 animate-bounce" /> Scroll
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeading
          kicker="Η ιστορία"
          title="Day 1 → Σήμερα"
          sub="Κάθε σταθμός, από το πρώτο track στο σφραγισμένο υπόγειο μέχρι τα sold out venues."
          action={
            <Link
              to="/story"
              className="underline-sweep hidden shrink-0 items-center gap-2 text-xs tracking-[0.2em] text-accent uppercase sm:flex"
            >
              Όλο το timeline <ArrowUpRight className="size-4" />
            </Link>
          }
        />
        <ol className="grid gap-4 sm:grid-cols-3">
          {timeline.slice(0, 3).map((m, i) => (
            <Reveal as="li" key={m.year} delay={i * 90}>
              <div className="hover-lift shine h-full rounded-xl border border-border/70 bg-card p-6">
                <p className="font-display text-4xl text-chrome">{m.year}</p>
                <h3 className="mt-3 text-lg">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <SectionHeading kicker="Discography" title="Τελευταία drops" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {releases.slice(0, 3).map((r, i) => (
            <ReleaseCard key={r.id} release={r} delay={i * 90} />
          ))}
        </div>
      </section>

      {/* --- LIVE SHOWS SECTION ME ΚΑΘΑΡΗ PARALLAX ΕΙΚΟΝΑ & SUPABASE DATA --- */}
      <section className="relative isolate my-16 min-h-[450px] overflow-hidden py-24">
        {/* Parallax Image Background */}
        <div ref={showsParallax.ref} className="absolute inset-0 z-0">
          <img
            src={gallery4}
            alt="Live show background"
            style={{ transform: `translate3d(0, ${showsParallax.offset}px, 0) scale(1.3)` }}
            className="h-full w-full object-cover object-center brightness-100 contrast-100 opacity-90 will-change-transform"
          />
        </div>

        <div className="absolute inset-0 z-1 bg-gradient-to-b from-background via-transparent to-background opacity-80" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <SectionHeading
            kicker="Live"
            title="Επόμενα shows"
            action={
              <Link
                to="/tour"
                className="underline-sweep hidden shrink-0 items-center gap-2 text-xs tracking-[0.2em] text-accent uppercase sm:flex"
              >
                Όλες οι ημερομηνίες <ArrowUpRight className="size-4" />
              </Link>
            }
          />

          <div className="rounded-2xl border border-border/60 bg-black/60 p-4 backdrop-blur-sm sm:p-6">
            {loadingShows ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Φόρτωση shows...</p>
            ) : dbShows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarOff className="size-10 text-accent/60" />
                <p className="mt-4 text-lg font-medium">Δεν υπάρχουν ανακοινωμένα live αυτή τη στιγμή.</p>
                <p className="mt-1 text-sm text-muted-foreground">Stay tuned για τα επόμενα tour dates!</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {dbShows.map((s, i) => {
                  const formattedDate = new Date(s.event_date).toLocaleDateString("el-GR", {
                    day: "numeric",
                    month: "short",
                  });

                  return (
                    <Reveal as="li" key={s.id} delay={i * 70}>
                      <div className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 transition-all duration-500 hover:px-3 sm:flex sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-display text-2xl transition-colors duration-300 group-hover:text-accent">
                            {s.city}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {formattedDate} · {s.venue}
                          </p>
                        </div>

                        {s.ticket_url && s.status !== "soldout" ? (
                          <a
                            href={s.ticket_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover-glow shrink-0 rounded-full border border-accent/60 bg-black/80 px-5 py-2 text-[11px] tracking-[0.2em] text-accent uppercase"
                          >
                            Tickets
                          </a>
                        ) : (
                          <Link
                            to="/tour"
                            className="hover-glow shrink-0 rounded-full border border-accent/60 bg-black/80 px-5 py-2 text-[11px] tracking-[0.2em] text-accent uppercase"
                          >
                            {s.status === "soldout" ? "Sold out" : "Tickets"}
                          </Link>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}