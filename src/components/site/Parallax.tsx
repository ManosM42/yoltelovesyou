import { useEffect, useRef, useState } from "react";

/** Returns a translateY offset (px) driven by the element's position in the viewport. */
export function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      setOffset(progress * speed * 240);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed]);

  return { ref, offset };
}

export function ParallaxImage({
  src,
  alt,
  speed = 0.2,
  className = "",
  imgClassName = "",
  width,
  height,
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
}) {
  const { ref, offset } = useParallax<HTMLDivElement>(speed);

  return (
    <div ref={ref} className={`group relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.18)` }}
        className={`size-full object-cover transition-[filter,transform] duration-700 will-change-transform group-hover:brightness-110 ${imgClassName}`}
      />
    </div>
  );
}
