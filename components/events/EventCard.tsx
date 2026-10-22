import Image from 'next/image';
import { ArrowRight, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice, type EventItem } from '@/lib/events/events';

type Props = {
  event: EventItem;
  saved: boolean;
  onToggleSaved: () => void;
  onSelect: () => void;
};

export function EventCard({ event, saved, onToggleSaved, onSelect }: Props) {
  const [day, month] = event.date.split(' ');
  return (
    <article className="event-card">
      <div className="event-card-image">
        <Image src={event.image} alt={event.title} width={1024} height={768} sizes="(min-width: 1100px) 33vw, (min-width: 480px) 50vw, 100vw" />
        <span className="event-date">
          {day}
          <small>{month}</small>
        </span>
        <Button variant="ghost" size="icon" className={`save-event ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Remover dos favoritos' : 'Favoritar'} ${event.title}`} aria-pressed={saved} onClick={onToggleSaved}>
          <Heart />
        </Button>
      </div>
      <div className="event-card-body">
        <span className="event-category">{event.category}</span>
        <h3>{event.title}</h3>
        <p>
          <MapPin />
          {event.venue} · {event.location}
        </p>
        <div className="event-card-footer">
          <div>
            <small>{event.price === null ? 'Ingressos' : 'A partir de'}</small>
            <strong>{event.price === null ? 'Em breve' : formatPrice(event.price)}</strong>
          </div>
          <Button variant="ghost" aria-label={`Ver ingressos de ${event.title}`} onClick={onSelect}>
            Ver evento
            <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  );
}
