'use client';

import { useState } from 'react';
import { Compass, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventDiscovery } from '@/components/events/EventDiscovery';
import { EventHeader } from '@/components/events/EventHeader';
import { EventSidebar, type HomeView } from '@/components/events/EventSidebar';
import { FeaturedEvent } from '@/components/events/FeaturedEvent';
import { EventDetailDialog, PasswordDialog, ProfileDialog, TicketDialog } from '@/components/events/HomeDialogs';
import { MyTickets } from '@/components/events/MyTickets';
import { UpcomingTicketStrip } from '@/components/events/UpcomingTicketStrip';
import { useEventList } from '@/components/events/useEventList';
import type { EventItem, EventPage } from '@/lib/events/events';

type Panel = 'profile' | 'password' | 'ticket' | null;

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function EventHome({ user, initialPage }: { user: { name: string; email: string }; initialPage: EventPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<HomeView>('discover');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  const list = useEventList(initialPage, query, category);
  // Stable across searches: both come from the unfiltered first page.
  const featured = initialPage.items[0];
  // Demo only: there is no reservations endpoint yet, so "my ticket" is just another event.
  const ticketEvent = initialPage.items[1] ?? featured;
  const initials = getInitials(user.name);

  const openPanel = (next: Panel) => {
    setPanel(next);
    setMenuOpen(false);
  };
  const closeDialogs = () => {
    setPanel(null);
    setSelected(null);
  };
  const selectView = (next: HomeView) => {
    setView(next);
    setMenuOpen(false);
  };
  const changeQuery = (next: string) => {
    setQuery(next);
    if (next) setView('discover');
  };
  const toggleSaved = (id: string) => setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div className="events-app">
      <EventSidebar
        open={menuOpen}
        view={view}
        onToggle={() => setMenuOpen((open) => !open)}
        onClose={() => setMenuOpen(false)}
        onSelectView={selectView}
        onOpenProfile={() => openPanel('profile')}
        onOpenPassword={() => openPanel('password')}
      />
      <div className="events-shell">
        <EventHeader query={query} initials={initials} onQueryChange={changeQuery} onOpenProfile={() => openPanel('profile')} />
        <main className="events-main">
          <div className="home-intro">
            <div>
              <p className="eyebrow">VIVA O PRÓXIMO ENCONTRO</p>
              <h1>
                Seu próximo momento começa aqui<span className="text-primary">.</span>
              </h1>
            </div>
            <span className="intro-note">Boa música. Boas histórias.</span>
          </div>
          <div className="events-tabs" role="tablist" aria-label="Eventos e ingressos">
            <Button variant="ghost" role="tab" aria-selected={view === 'discover'} className={view === 'discover' ? 'selected' : ''} onClick={() => setView('discover')}>
              <Compass />
              Explorar eventos
            </Button>
            <Button variant="ghost" role="tab" aria-selected={view === 'tickets'} className={view === 'tickets' ? 'selected' : ''} onClick={() => setView('tickets')}>
              <Ticket />
              Meus ingressos<span className="count-badge">2</span>
            </Button>
          </div>
          {view === 'discover' ? (
            <>
              {featured && !query && category === 'Todos' && <FeaturedEvent event={featured} onSelect={setSelected} />}
              {ticketEvent && <UpcomingTicketStrip event={ticketEvent} onOpen={() => openPanel('ticket')} />}
              <EventDiscovery
                events={list.events}
                hasMore={list.hasMore}
                loading={list.loading}
                error={list.error}
                onLoadMore={list.loadMore}
                query={query}
                category={category}
                saved={saved}
                onCategoryChange={setCategory}
                onToggleSaved={toggleSaved}
                onSelect={setSelected}
                onClearFilters={() => {
                  setQuery('');
                  setCategory('Todos');
                }}
              />
            </>
          ) : (
            ticketEvent ? <MyTickets event={ticketEvent} onOpenTicket={() => openPanel('ticket')} onDiscover={() => setView('discover')} /> : null
          )}
          <footer className="events-footer">
            <span>
              © 2026 nox. <span className="footer-tagline">Seu espaço, em outra frequência.</span>
            </span>
            <span className="demo-label">Prévia · eventos e ingressos fictícios</span>
          </footer>
        </main>
      </div>
      {selected && <EventDetailDialog event={selected} onClose={closeDialogs} />}
      {panel === 'ticket' && ticketEvent && <TicketDialog event={ticketEvent} holder={user.name} onClose={closeDialogs} />}
      {panel === 'profile' && <ProfileDialog name={user.name} email={user.email} initials={initials} onClose={closeDialogs} />}
      {panel === 'password' && <PasswordDialog onClose={closeDialogs} />}
    </div>
  );
}
