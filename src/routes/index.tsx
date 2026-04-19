import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Phone } from "lucide-react";
import { LocationCard } from "@/components/LocationCard";
import { RsvpForm } from "@/components/RsvpForm";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Șerban & Dora · Nunta noastră" },
      { name: "description", content: "Cu bucurie vă invităm la nunta noastră" },
    ],
  }),
});

const WEDDING_DATE = new Date("2026-08-29T19:00:00+03:00");

function Countdown() {
  const compute = () => {
    const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff / 3_600_000) % 24);
    const minutes = Math.floor((diff / 60_000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [time, setTime] = useState(compute);

  useEffect(() => {
    const id = setInterval(() => setTime(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex min-w-[64px] flex-col items-center rounded-md border border-gold/30 bg-card/60 px-3 py-2 shadow-elegant sm:min-w-[80px] sm:px-4 sm:py-3">
      <span className="font-serif text-2xl tabular-nums text-foreground sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold sm:text-xs">
        {label}
      </span>
    </div>
  );

  return (
    <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3">
      <Unit value={time.days} label="Zile" />
      <Unit value={time.hours} label="Ore" />
      <Unit value={time.minutes} label="Min" />
      <Unit value={time.seconds} label="Sec" />
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl font-light text-foreground sm:text-5xl">{title}</h2>
      <div className="divider-gold mx-auto mt-5 w-32" />
    </div>
  );
}

function Index() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gold/20 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl text-center">
          {/* Hidden for now
          <div className="mx-auto mb-8 h-48 w-48 overflow-hidden rounded-full border-2 border-gold/60 shadow-[0_0_60px_-10px_rgba(201,162,81,0.55)] ring-4 ring-gold/10 sm:h-60 sm:w-60 md:h-72 md:w-72">
            <img
              src="/hero.jpg"
              alt="Șerban și Dora"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          */}
          <p className="text-xs uppercase tracking-[0.5em] text-gold">Save the Date</p>
          <p className="mt-8 font-serif text-xl text-muted-foreground">Cu bucurie vă invităm la nunta noastră</p>

          <h1 className="mt-6 flex flex-col items-center font-script text-7xl text-gold sm:text-8xl md:text-9xl">
            <span>Șerban</span>
            <span className="my-2 flex items-center gap-4 text-3xl text-foreground sm:text-4xl">
              <span className="h-px w-16 bg-gold/50" />
              <Heart className="h-5 w-5 text-gold" fill="currentColor" />
              <span className="h-px w-16 bg-gold/50" />
            </span>
            <span>Dora</span>
          </h1>

          <div className="mt-10 space-y-2">
            <p className="font-serif text-2xl text-foreground sm:text-3xl">29 August 2026</p>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Oradea</p>
          </div>

          <Countdown />

          <div className="mt-12">
            <a
              href="#rsvp"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("rsvp");
                if (!el) return;
                const startY = window.scrollY;
                const targetY = el.getBoundingClientRect().top + startY;
                const duration = 1600;
                const startTime = performance.now();
                const ease = (t: number) => 1 - Math.pow(1 - t, 3);
                const step = (now: number) => {
                  const t = Math.min(1, (now - startTime) / duration);
                  window.scrollTo(0, startY + (targetY - startY) * ease(t));
                  if (t < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
              }}
              className="inline-flex items-center justify-center rounded-md border border-gold bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold-foreground transition-all hover:bg-transparent hover:text-gold"
            >
              Confirmă prezența
            </a>
          </div>
        </div>
      </section>

      {/* FAMILIA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Alături de noi" title="Familia noastră" />

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div className="rounded-lg border border-gold/30 bg-card p-8 text-center shadow-elegant">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Părinții mirelui</p>
              <p className="mt-4 font-serif text-xl text-foreground">Gheorghe · Mariana</p>
              <p className="mt-2 text-sm uppercase tracking-[0.35em] text-gold">Demeter</p>
            </div>
            <div className="rounded-lg border border-gold/30 bg-card p-8 text-center shadow-elegant">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Părinții miresei</p>
              <p className="mt-4 font-serif text-xl text-foreground">Dorel · Rodica</p>
              <p className="mt-2 text-sm uppercase tracking-[0.35em] text-gold">Temian</p>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-gold/30 bg-card p-8 text-center shadow-elegant">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Nașii noștri</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="font-serif text-lg text-foreground">Alexandru · Alexandra</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-gold">Bancu</p>
              </div>
              <div>
                <p className="font-serif text-lg text-foreground">Ionuț · Mariana</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-gold">Marți</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM ZIUA NUNTII */}
      <section className="bg-secondary/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="23 August 2026" title="Ziua cununiei" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground">
            Trei momente speciale în ziua în care ne unim destinele.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <LocationCard
              subtitle="Cununia civilă"
              title="Primăria Oradea"
              date="Duminică, 23 August 2026"
              time="13:20"
              address="Primăria Municipiului Oradea"
              mapsQuery="Primăria Municipiului Oradea, Oradea, Romania"
              image="/primaria.jpg"
            />
            <LocationCard
              subtitle="Cununia religioasă"
              title="Biserica cu Lună"
              date="Duminică, 23 August 2026"
              time="14:00"
              address="Biserica cu Lună, Oradea"
              mapsQuery="Biserica cu Lună, Oradea, Romania"
              image="/biserica.jpg"
            />
            <LocationCard
              subtitle="Petrecere după cununie"
              title="Splash Party"
              date="Duminică, 23 August 2026"
              time="15:30"
              address="Cheriu, Bihor"
              mapsQuery="Splash Party Cheriu, Bihor, Romania"
              image="/splash.jpg"
            />
          </div>
        </div>
      </section>

      {/* MAIN PARTY */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="29 August 2026" title="Palazzo Grand Hall" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground">
            Vă așteptăm cu drag să sărbătorim alături de noi într-o seară de neuitat.
          </p>
          <div className="mt-12">
            <LocationCard
              subtitle="Petrecerea de nuntă"
              title="Palazzo Grand Hall"
              date="Sâmbătă, 29 August 2026"
              time="19:00"
              address="Str. Ciheiului 65, Oradea"
              mapsQuery="Palazzo Grand Hall, Strada Ciheiului 65, Oradea, Romania"
              image="/palazzo.jpg"
            />
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="bg-secondary/30 px-6 py-20 scroll-mt-10">
        <div className="mx-auto max-w-2xl">
          <SectionTitle eyebrow="RSVP" title="Confirmă prezența" />
          <p className="mx-auto mt-6 max-w-xl text-center text-muted-foreground">
            Te rugăm să ne confirmi prezența până la <strong className="text-foreground">20 iunie 2026</strong>,
            completând formularul de mai jos.
          </p>

          <div className="mt-10">
            <RsvpForm />
          </div>

          <div className="mt-10 rounded-lg border border-gold/30 bg-card p-6 text-center shadow-elegant">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Sau telefonic</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <a
                href="tel:+40757238380"
                className="flex items-center justify-center gap-3 rounded-md border border-gold/30 bg-background px-4 py-3 text-foreground transition-colors hover:bg-secondary"
              >
                <Phone className="h-4 w-4 text-gold" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">Șerban</span>
                  <span className="font-medium">0757 238 380</span>
                </span>
              </a>
              <a
                href="tel:+40752174406"
                className="flex items-center justify-center gap-3 rounded-md border border-gold/30 bg-background px-4 py-3 text-foreground transition-colors hover:bg-secondary"
              >
                <Phone className="h-4 w-4 text-gold" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">Dora</span>
                  <span className="font-medium">0752 174 406</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gold/20 px-6 py-10 text-center">
        <p className="font-script text-3xl text-gold">Șerban &amp; Dora</p>
        <p className="mt-2 text-sm text-muted-foreground">23 August 2026 · Oradea</p>
        <Link
          to="/admin"
          className="mt-4 inline-block text-xs text-muted-foreground/60 hover:text-gold"
        >
          Admin
        </Link>
      </footer>
    </main>
  );
}
