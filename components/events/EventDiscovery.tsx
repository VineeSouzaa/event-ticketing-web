import { Compass, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/EventCard';
import { categories, type EventItem } from '@/lib/events/events';

type Props = {
  events: EventItem[];
  query: string;
  category: string;
  saved: string[];
  hasMore: boolean;
  loading: boolean;
  error: boolean;
  onLoadMore: () => void;
  onCategoryChange: (category: string) => void;
  onToggleSaved: (id: string) => void;
  onSelect: (event: EventItem) => void;
  onClearFilters: () => void;
};

const countLabel = (count: number, hasMore: boolean) => `${count}${hasMore ? '+' : ''}`;

export function EventDiscovery({ events, query, category, saved, hasMore, loading, error, onLoadMore, onCategoryChange, onToggleSaved, onSelect, onClearFilters }: Props) {
  return (
    <section className="event-discovery" aria-label="Eventos disponíveis">
      <div className="section-heading">
        <div>
          <h2>{query ? 'Resultados da busca' : 'Encontre sua próxima experiência'}</h2>
          <p>{query ? `${countLabel(events.length, hasMore)} ${events.length === 1 && !hasMore ? 'evento encontrado' : 'eventos encontrados'}` : 'Escolha o evento. O resto vira história.'}</p>
        </div>
        <span className="results-count">{countLabel(events.length, hasMore)} eventos</span>
      </div>
      <div className="category-filters" aria-label="Categorias">
        {categories.map((item) => (
          <Button key={item} variant="ghost" className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => onCategoryChange(item)}>
            {item === 'Todos' && <Compass />}
            {item}
          </Button>
        ))}
      </div>
      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} saved={saved.includes(event.id)} onToggleSaved={() => onToggleSaved(event.id)} onSelect={() => onSelect(event)} />
        ))}
      </div>
      {hasMore && (
        <Button variant="outline" className="mx-auto mt-6" disabled={loading} onClick={onLoadMore}>
          {loading ? 'Carregando…' : 'Carregar mais eventos'}
        </Button>
      )}
      {error && (
        <p role="alert" className="form-notice">
          Não foi possível carregar os eventos. Tente novamente.
        </p>
      )}
      {events.length === 0 && !loading && !error && (
        <div className="empty-events">
          <Search />
          <h3>Nenhum evento por aqui.</h3>
          <p>Tente outro nome ou categoria.</p>
          <Button variant="outline" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        </div>
      )}
    </section>
  );
}
