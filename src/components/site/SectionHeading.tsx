import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  sub,
  action,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
      <div className="min-w-0">
        {kicker && (
          <p className="mb-3 text-xs tracking-[0.35em] text-accent uppercase">{kicker}</p>
        )}
        <h2 className="text-4xl leading-[0.95] sm:text-6xl">
          <span className="text-chrome">{title}</span>
        </h2>
        {sub && <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{sub}</p>}
      </div>
      {action}
    </Reveal>
  );
}