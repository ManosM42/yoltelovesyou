import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import LoadingScreen from "@/components/site/LoadingScreen";

// Imports για το Popup & Audio
import blickAudio from "@/assets/BLICK.mp3";
import gallery4 from "@/assets/gallery-3.jpg";
import { Volume2, VolumeX } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Yolte — Official Site" },
      { name: "description", content: "Yolte: Greek rap, day 1 → σήμερα. Music, tour, community." },
      { name: "author", content: "Yolte" },
      { property: "og:title", content: "Yolte — Official Site" },
      { property: "og:description", content: "Yolte: Greek rap, day 1 → σήμερα." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isLoading, setIsLoading] = useState(true);

  // States για το Popup και τη Μουσική
  const [showPopup, setShowPopup] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Έλεγχος αν ο χρήστης έχει επισκεφτεί ξανά το site (localStorage)
  useEffect(() => {
    const hasVisited = localStorage.getItem("yolte_visited");
    if (!hasVisited) {
      setShowPopup(true);
    }
  }, []);

  const handleFinishPopup = () => {
    // Αποθήκευση ώστε να μην ξαναεμφανιστεί το popup σε επόμενη επίσκεψη
    localStorage.setItem("yolte_visited", "true");
    setShowPopup(false);

    // Αν ο χρήστης επέλεξε Music On, παίζει η μουσική
    if (musicEnabled && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Audio autoplay prevented:", err);
      });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {/* Global Persistent Audio - Συνεχίζει να παίζει σε όλο το site αδιάκοπα */}
      <audio ref={audioRef} src={blickAudio} loop preload="auto" />

      {/* POPUP OVERLAY (Εμφανίζεται μόνο την πρώτη φορά και αφού τελειώσει το Loading Screen) */}
      {!isLoading && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={gallery4}
              alt="Popup Background"
              className="size-full object-cover object-center brightness-75 filter"
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          </div>

          <div className="relative z-10 mx-5 w-full max-w-md rounded-2xl border border-border/60 bg-black/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-xs tracking-[0.4em] text-accent uppercase">Welcome</p>
            <h2 className="mt-3 font-display text-3xl tracking-wide text-white sm:text-4xl">
              ΠΡΟΣΑΡΜΟΣΤΕ ΤΗΝ ΕΜΠΕΙΡΙΑ ΣΑΣ
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Επιλέξτε αν θέλετε να ενεργοποιήσετε τη μουσική υπόκρουση για μια ολοκληρωμένη εμπειρία.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setMusicEnabled(true)}
                className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  musicEnabled
                    ? "border-accent bg-accent/20 text-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                    : "border-border bg-black/40 text-muted-foreground hover:border-border/80"
                }`}
              >
                <Volume2 className="size-4" /> Music On
              </button>
              <button
                type="button"
                onClick={() => setMusicEnabled(false)}
                className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  !musicEnabled
                    ? "border-accent bg-accent/20 text-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                    : "border-border bg-black/40 text-muted-foreground hover:border-border/80"
                }`}
              >
                <VolumeX className="size-4" /> Music Off
              </button>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleFinishPopup}
                className="hover-glow shine w-full rounded-full bg-primary py-3.5 text-xs tracking-[0.3em] text-primary-foreground uppercase shadow-lg transition-transform active:scale-95"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen που εμφανίζεται στην αρχή */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className="grain min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}