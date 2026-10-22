import Link from 'next/link';
import { ChevronDown, MapPin, Search, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  query: string;
  initials: string;
  onQueryChange: (query: string) => void;
  onOpenProfile: () => void;
};

export function EventHeader({ query, initials, onQueryChange, onOpenProfile }: Props) {
  return (
    <header className="events-header">
      <Link href="/" className="wordmark" aria-label="Nox, início">
        <Zap strokeWidth={2.2} />
        nox<span className="text-primary">.</span>
      </Link>
      <label className="event-search">
        <Search />
        <input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Busque eventos, artistas ou lugares" aria-label="Pesquisar eventos" />
        {query && (
          <Button variant="ghost" size="icon" aria-label="Limpar pesquisa" onClick={() => onQueryChange('')}>
            <X />
          </Button>
        )}
      </label>
      <div className="header-actions">
        <span className="event-city">
          <MapPin />
          São Paulo, SP
        </span>
        <Button variant="ghost" className="avatar-button" onClick={onOpenProfile} aria-label="Meu perfil">
          <span className="avatar">{initials}</span>
          <ChevronDown />
        </Button>
      </div>
    </header>
  );
}
