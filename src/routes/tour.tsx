import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CalendarOff, MapPin, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Newsletter } from "@/components/site/Newsletter";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "Tour Dates 2026 — Yolte Live" },
      {
        name: "description",
        content: "Όλες οι ημερομηνίες του Yolte: πόλεις, venues και εισιτήρια.",
      },
      { property: "og:title", content: "Tour Dates 2026 — Yolte Live" },
      { property: "og:description", content: "Δες πότε παίζει ο Yolte στην πόλη σου." },
    ],
  }),
  component: TourPage,
});

type Show = {
  id: string;
  city: string;
  venue: string;
  event_date: string;
  ticket_url?: string;
  maps_url?: string;
  status: "tickets" | "soldout" | "cancelled";
};

function TourPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTourShows() {
      try {
        const { data, error } = await supabase
          .from("shows")
          .select("*")
          .order("event_date", { ascending: true });

        if (!error && data) {
          setShows(data);
        }
      } catch (err) {
        console.error("Failed to load tour shows", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTourShows();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <p className="text-xs tracking-[0.35em] text-accent uppercase">Live</p>
          <h1 className="mt-4 text-6xl leading-[0.9] sm:text-8xl">
            <span className="text-violet-chrome">Tour 2026</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">
            Δεν είναι show, είναι μάζωξη. Έλα να το ζήσεις από κοντά.
          </p>
        </Reveal>

        <div className="mt-12">
          {loading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Φόρτωση ημερομηνιών...
            </p>
          ) : shows.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 py-16 text-center">
              <CalendarOff className="size-12 text-accent/60" />
              <p className="mt-4 text-xl font-bold">Δεν έχουν ανακοινωθεί live ημερομηνίες ακόμα.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ο Yolte ετοιμάζει το επόμενο τουρ. Μείνε συντονισμένος!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60 border-y border-border/60">
              {shows.map((s, i) => {
                const formattedDate = new Date(s.event_date).toLocaleDateString("el-GR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });

                return (
                  <Reveal as="li" key={s.id} delay={i * 60}>
                    <div className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-6 transition-all duration-500 hover:bg-card/60 hover:sm:px-5 sm:flex sm:justify-between sm:px-2">
                      <div className="min-w-0">
                        <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
                          {formattedDate}
                        </p>
                        <p className="mt-1 font-display text-3xl transition-colors duration-300 group-hover:text-accent">
                          {s.city}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{s.venue}</span>
                          {s.maps_url && (
                            <a
                              href={s.maps_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-accent/80 hover:text-accent underline"
                            >
                              <MapPin className="size-3" /> Χάρτης
                            </a>
                          )}
                        </div>
                      </div>

                      {s.status === "soldout" ? (
                        <span className="shrink-0 rounded-full border border-border px-5 py-2 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                          Sold out
                        </span>
                      ) : s.ticket_url ? (
                        <a
                          href={s.ticket_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover-glow shine inline-flex items-center gap-1.5 shrink-0 rounded-full bg-primary px-6 py-2.5 text-[11px] tracking-[0.2em] text-primary-foreground uppercase"
                        >
                          Εισιτήρια <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <span className="shrink-0 rounded-full border border-accent/40 px-5 py-2 text-[11px] tracking-[0.2em] text-accent uppercase">
                          Σύντομα
                        </span>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Newsletter />
    </>
  );
}