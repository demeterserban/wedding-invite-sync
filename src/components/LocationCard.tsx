import { MapPin, Navigation } from "lucide-react";

interface LocationCardProps {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  address: string;
  mapsQuery: string;
  image?: string;
}

export function LocationCard({ title, subtitle, date, time, address, mapsQuery, image }: LocationCardProps) {
  const encoded = encodeURIComponent(mapsQuery);
  const embedSrc = `https://www.google.com/maps?q=${encoded}&output=embed`;
  const navigateUrl = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
  const viewUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <div className="overflow-hidden rounded-lg border border-gold/30 bg-card shadow-elegant">
      {image && (
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-card" />
        </div>
      )}

      <div className="p-6 text-center sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{subtitle}</p>
        <h3 className="mt-3 font-serif text-2xl font-medium text-foreground sm:text-3xl">{title}</h3>
        <div className="divider-gold mx-auto my-5 w-24" />
        <p className="text-lg text-foreground">{date}</p>
        <p className="mt-1 text-3xl font-light text-gold">{time}</p>
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-gold" />
          {address}
        </p>
      </div>

      <div className="aspect-[16/9] w-full bg-muted">
        <iframe
          title={`Hartă ${title}`}
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="grid grid-cols-2 divide-x divide-gold/20 border-t border-gold/20">
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <MapPin className="h-4 w-4 text-gold" />
          Vezi pe hartă
        </a>
        <a
          href={navigateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Navigation className="h-4 w-4 text-gold" />
          Navighează
        </a>
      </div>
    </div>
  );
}
