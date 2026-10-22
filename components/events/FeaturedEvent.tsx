import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EventItem } from '@/lib/events/events';

export function FeaturedEvent({ event, onSelect }: { event: EventItem; onSelect: (event: EventItem) => void }) {
  return (
    <section className="featured-event" aria-label="Evento em destaque">
      {/* The featured banner is the LCP element of the home: preload it. */}
      <Image src={event.image} alt={event.title} fill priority sizes="(min-width: 1480px) 1400px, 100vw" />
      <div className="featured-copy">
        <span className="feature-label">
          <span />
          EM DESTAQUE
        </span>
        <p className="feature-date">{event.date} · {event.location.toUpperCase()}</p>
        <h2>
          {event.title}
          <span className="text-primary">.</span>
        </h2>
        <p className="feature-description">{event.venue}</p>
        <Button variant="neon" className="feature-cta" onClick={() => onSelect(event)}>
          Quero estar lá
          <ArrowRight />
        </Button>
      </div>
      <span className="feature-edition">
        EDIÇÃO {event.year}
      </span>
    </section>
  );
}
