import { createFileRoute } from "@tanstack/react-router";
import { timeline } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { ParallaxImage } from "@/components/site/Parallax";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Η ιστορία του Yolte — Day 1 → Σήμερα" },
      {
        name: "description",
        content:
          "Interactive timeline: πρώτο track, πρώτο live, viral moment, συνεργασίες και sold out tour.",
      },
      { property: "og:title", content: "Η ιστορία του Yolte — Day 1 → Σήμερα" },
      { property: "og:description", content: "Κάθε σταθμός της πορείας του Yolte, χρόνο με χρόνο." },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <Reveal>
        <p className="text-xs tracking-[0.35em] text-accent uppercase">Η ιστορία</p>
        <h1 className="mt-4 text-6xl leading-[0.9] sm:text-8xl">
          <span className="text-violet-chrome">Day 1 → Σήμερα</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Τίποτα δεν ήρθε overnight. Κάθε χρονιά, ένα βήμα πιο μπροστά.
        </p>
      </Reveal>

      <ol className="relative mt-16 space-y-14 border-l border-border/70 pl-6 sm:pl-10">
        {timeline.map((m, i) => (
          <Reveal as="li" key={m.year + m.title} delay={i * 60} className="relative">
            <span className="absolute top-2 -left-[1.65rem] size-3 rounded-full bg-accent shadow-[var(--glow-accent)] sm:-left-[2.85rem]" />
            <div className="grid gap-6 sm:grid-cols-[1fr_1.1fr] sm:items-center">
              <ParallaxImage
                src={m.image}
                alt={m.title}
                width={1024}
                height={768}
                speed={i % 2 === 0 ? 0.18 : -0.18}
                className="hover-lift shine aspect-[4/3] rounded-xl border border-border/70"
              />
              <div className="min-w-0">
                <p className="font-display text-5xl text-chrome transition-transform duration-500 hover:translate-x-1">
                  {m.year}
                </p>
                <h2 className="mt-2 text-2xl">{m.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{m.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}