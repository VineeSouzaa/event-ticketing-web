import type { components } from '@/lib/api/schema';

type EventSummaryDto = components['schemas']['EventSummaryDto'];
type EventDetailDto = components['schemas']['EventDetailDto'];

export type EventItem = {
  id: string;
  title: string;
  category: string;
  /** Short form for the card badge, e.g. "14 NOV". */
  date: string;
  fullDate: string;
  time: string;
  location: string;
  venue: string;
  /** Cheapest tier, in BRL; null when the event has no tiers yet. */
  price: number | null;
  image: string;
  year: number;
};

export type TicketTier = components['schemas']['TicketTierDto'];
export type EventDetail = { description: string; tiers: TicketTier[] };

export type EventPage = { items: EventItem[]; nextCursor: string | null };

export const categories = ['Todos', 'Shows', 'Festivais', 'Eletrônica'];

const FALLBACK_IMAGE = '/events/event-horizon.jpg';

// Fixed zone: the same string must come out on the server and in the browser (hydration).
const TIME_ZONE = 'America/Sao_Paulo';
const part = (date: Date, options: Intl.DateTimeFormatOptions, type: Intl.DateTimeFormatPartTypes) =>
  new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, ...options })
    .formatToParts(date)
    .find((p) => p.type === type)?.value ?? '';

export function toEventItem(dto: EventSummaryDto): EventItem {
  const startsAt = new Date(dto.startsAt);
  const day = part(startsAt, { day: '2-digit' }, 'day');
  const month = part(startsAt, { month: 'short' }, 'month').replace('.', '').toUpperCase();
  return {
    id: dto.id,
    title: dto.name,
    category: dto.category,
    date: `${day} ${month}`,
    fullDate: new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, dateStyle: 'long' }).format(startsAt),
    time: new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, timeStyle: 'short' }).format(startsAt),
    location: dto.city,
    venue: dto.venue,
    price: dto.minPrice === null ? null : Number(dto.minPrice),
    image: dto.imageUrl ?? FALLBACK_IMAGE,
    year: Number(part(startsAt, { year: 'numeric' }, 'year')),
  };
}

export const toEventDetail = ({ description, tiers }: EventDetailDto): EventDetail => ({ description, tiers });

export const toEventPage = (page: components['schemas']['EventPageDto']): EventPage => ({
  items: page.items.map(toEventItem),
  nextCursor: page.nextCursor,
});

export const formatPrice = (price: number) =>
  price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
