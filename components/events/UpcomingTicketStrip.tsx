import { ArrowRight, Check, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EventItem } from '@/lib/events/events';

// Demo content: there is no reservations endpoint yet, so this strip is static.
export function UpcomingTicketStrip({ event, onOpen }: { event: EventItem; onOpen: () => void }) {
  return (
    <section className="upcoming-ticket" aria-label="Seu próximo evento">
      <div className="ticket-strip-icon">
        <Ticket />
      </div>
      <div className="ticket-strip-copy">
        <span>SEU PRÓXIMO ENCONTRO</span>
        <strong>{event.title}</strong>
        <p>{event.date.toLowerCase()} · {event.time} · {event.venue}</p>
      </div>
      <span className="confirmed">
        <Check />2 ingressos confirmados
      </span>
      <Button variant="ghost" onClick={onOpen}>
        Ver ingressos
        <ArrowRight />
      </Button>
    </section>
  );
}
