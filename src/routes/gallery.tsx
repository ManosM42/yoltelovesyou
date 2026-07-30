import { createFileRoute } from "@tanstack/react-router";
import { gallery } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { ParallaxImage } from "@/components/site/Parallax";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery & Behind The Scenes — Yolte" },
      {
        name: "description",
        content: "Φωτογραφίες από studio sessions, backstage και live shows του Yolte.",
      },
      { property: "og:title", content: "Gallery & Behind The Scenes — Yolte" },
      { property: "og:description", content: "Studio, backstage, σκηνή. Χωρίς φίλτρα." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20">
      <Reveal>
        <p className="text-xs tracking-[0.35em] text-accent uppercase">Behind the scenes</p>
        <h1 className="mt-4 text-6xl leading-[0.9] sm:text-8xl">
          <span className="text-violet-chrome">Gallery</span>
        </h1>
      </Reveal>

      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {gallery.map((img, i) => (
          <Reveal key={i} delay={(i % 3) * 80} className="break-inside-avoid">
            <figure className="group hover-lift shine relative overflow-hidden rounded-xl border border-border/70">
              <ParallaxImage
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                speed={0.12}
                className={i % 2 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"}
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background to-transparent p-4 text-xs text-muted-foreground transition-transform duration-500 group-hover:translate-y-0">
                {img.alt}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}