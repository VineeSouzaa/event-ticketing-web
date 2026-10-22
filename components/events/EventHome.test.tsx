import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventItem, EventPage } from '@/lib/events/events';
import { EventHome } from './EventHome';

const { fetchEventsPage, fetchEventDetail } = vi.hoisted(() => ({
  fetchEventsPage: vi.fn(),
  fetchEventDetail: vi.fn(),
}));
vi.mock('@/lib/api/auth', () => ({ signOut: vi.fn() }));
vi.mock('@/lib/api/events', () => ({ fetchEventsPage, fetchEventDetail }));

const user = { name: 'Vinicius Souza', email: 'vini@example.com' };

const event = (id: string, title: string, category: string): EventItem => ({
  id,
  title,
  category,
  date: '14 NOV',
  fullDate: '14 de novembro de 2026',
  time: '18:00',
  location: 'São Paulo, SP',
  venue: 'Casa',
  price: 85,
  image: '/events/event-jazz.jpg',
  year: 2026,
});

const frequency = event('1', 'Frequência Festival', 'Eletrônica');
const horizon = event('2', 'Horizonte Music Festival', 'Festivais');
const jazz = event('3', 'Jazz After Hours', 'Shows');
const firstPage: EventPage = { items: [frequency, horizon], nextCursor: 'next' };

describe('EventHome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchEventDetail.mockResolvedValue({
      description: 'Noite de jazz.',
      tiers: [{ id: 't', name: 'Pista', price: '85.00', totalQuantity: 10, available: 4 }],
    });
  });

  it('shows the session user initials', () => {
    render(<EventHome user={user} initialPage={firstPage} />);
    expect(screen.getAllByText('VS').length).toBeGreaterThan(0);
  });

  it('renders the server-provided first page and offers more', () => {
    render(<EventHome user={user} initialPage={firstPage} />);
    expect(screen.getByRole('button', { name: 'Ver ingressos de Horizonte Music Festival' })).toBeInTheDocument();
    expect(screen.getByText('2+ eventos')).toBeInTheDocument();
  });

  it('loads the next page with the cursor and appends it', async () => {
    fetchEventsPage.mockResolvedValue({ items: [jazz], nextCursor: null });
    const u = userEvent.setup();
    render(<EventHome user={user} initialPage={firstPage} />);
    await u.click(screen.getByRole('button', { name: 'Carregar mais eventos' }));
    expect(fetchEventsPage).toHaveBeenCalledWith({ q: '', category: 'Todos', cursor: 'next' });
    expect(await screen.findByRole('button', { name: 'Ver ingressos de Jazz After Hours' })).toBeInTheDocument();
    expect(screen.getByText('3 eventos')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Carregar mais eventos' })).not.toBeInTheDocument();
  });

  it('searches on the server and shows the empty state', async () => {
    fetchEventsPage.mockResolvedValueOnce({ items: [jazz], nextCursor: null });
    const u = userEvent.setup();
    render(<EventHome user={user} initialPage={firstPage} />);
    await u.type(screen.getByLabelText('Pesquisar eventos'), 'jazz');
    expect(await screen.findByText('1 evento encontrado')).toBeInTheDocument();
    expect(fetchEventsPage).toHaveBeenLastCalledWith({ q: 'jazz', category: 'Todos' });

    fetchEventsPage.mockResolvedValueOnce({ items: [], nextCursor: null });
    await u.clear(screen.getByLabelText('Pesquisar eventos'));
    await u.type(screen.getByLabelText('Pesquisar eventos'), 'zzz');
    expect(await screen.findByText('Nenhum evento por aqui.')).toBeInTheDocument();
  });

  it('filters by category on the server', async () => {
    fetchEventsPage.mockResolvedValue({ items: [jazz], nextCursor: null });
    const u = userEvent.setup();
    render(<EventHome user={user} initialPage={firstPage} />);
    await u.click(screen.getByRole('button', { name: 'Shows' }));
    expect(await screen.findByRole('button', { name: 'Ver ingressos de Jazz After Hours' })).toBeInTheDocument();
    expect(fetchEventsPage).toHaveBeenCalledWith({ q: '', category: 'Shows' });
  });

  it('shows an error when loading fails', async () => {
    fetchEventsPage.mockRejectedValue(new Error('boom'));
    const u = userEvent.setup();
    render(<EventHome user={user} initialPage={firstPage} />);
    await u.click(screen.getByRole('button', { name: 'Carregar mais eventos' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar');
  });

  it('toggles a favorite', async () => {
    const u = userEvent.setup();
    render(<EventHome user={user} initialPage={firstPage} />);
    await u.click(screen.getByRole('button', { name: 'Favoritar Horizonte Music Festival' }));
    expect(screen.getByRole('button', { name: 'Remover dos favoritos Horizonte Music Festival' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('loads the detail with tier availability and does not simulate a purchase', async () => {
    const u = userEvent.setup();
    render(<EventHome user={user} initialPage={firstPage} />);
    await u.click(screen.getByRole('button', { name: 'Ver ingressos de Horizonte Music Festival' }));
    expect(fetchEventDetail).toHaveBeenCalledWith('2');
    expect(await screen.findByText('4 restantes')).toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: /Comprar ingresso/ }));
    expect(screen.getByRole('status')).toHaveTextContent('ainda não está conectada');
  });
});
