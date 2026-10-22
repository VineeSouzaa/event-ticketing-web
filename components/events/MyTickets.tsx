import Image from 'next/image';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EventItem } from '@/lib/events/events';

// Demo content: no reservations endpoint yet.
export function MyTickets({ event, onOpenTicket, onDiscover }: { event: EventItem; onOpenTicket: () => void; onDiscover: () => void }) {
  return (
    <section className="my-tickets">
      <div className="section-heading">
        <div>
          <h2>Tem encontro marcado.</h2>
          <p>Seus ingressos, todos no mesmo lugar.</p>
        </div>
        <span className="confirmed">
          <Check />
          Próximo evento
        </span>
      </div>
      <article className="owned-ticket">
        <Image src={event.image} width={1024} height={768} alt={event.title} />
        <div>
          <span className="event-category">{event.date} · {event.time}</span>
          <h3>{event.title}</h3>
          <p>
            <MapPin />
            {event.venue} · {event.location}
          </p>
          <span className="confirmed">
            <Check />2 ingressos · Pista
          </span>
        </div>
        <Button variant="neon" onClick={onOpenTicket}>
          Ver meus ingressos
          <ArrowRight />
        </Button>
      </article>
      <Button variant="link" className="mt-6" onClick={onDiscover}>
        Encontrar meu próximo evento
        <ArrowRight />
      </Button>
    </section>
  );
}
