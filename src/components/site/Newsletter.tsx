import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Reveal } from "./Reveal";

const emailSchema = z.string().trim().email().max(255);

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="border-y border-border/60 bg-[var(--gradient-violet)]">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.35em] text-accent uppercase">Stay locked in</p>
          <h2 className="mt-4 text-4xl leading-[0.95] sm:text-5xl">
            <span className="text-chrome">Μη χάσεις drop</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Νέα κομμάτια, tour dates και ανακοινώσεις — πρώτος εσύ, χωρίς spam.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const parsed = emailSchema.safeParse(email);
              if (!parsed.success) {
                toast.error("Βάλε ένα σωστό email.");
                return;
              }
              setEmail("");
              toast.success("Μπήκες στη λίστα. Τα λέμε στο επόμενο drop.");
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              maxLength={255}
              className="min-w-0 flex-1 rounded-full border border-input bg-background/60 px-5 py-3 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-6 py-3 text-xs tracking-[0.2em] text-primary-foreground uppercase transition-shadow hover:shadow-[var(--glow-accent)]"
            >
              Sign up
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}