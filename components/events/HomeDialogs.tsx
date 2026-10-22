'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { ArrowDownToLine, ArrowRight, CalendarDays, Check, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { fetchEventDetail } from '@/lib/api/events';
import { formatPrice, type EventDetail, type EventItem } from '@/lib/events/events';

// Every action in these dialogs is intentionally unconnected: the backend has no purchase,
// profile-update or password-change endpoint yet, and nothing here simulates success.

function Notice({ message }: { message: string }) {
  return message ? (
    <p role="status" className="form-notice">
      {message}
    </p>
  ) : null;
}

export function EventDetailDialog({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const [notice, setNotice] = useState('');
  // undefined = loading, null = failed. The list only carries the summary; description and
  // per-tier availability come from the detail endpoint.
  const [detail, setDetail] = useState<EventDetail | null | undefined>(undefined);
  useEffect(() => {
    let active = true;
    fetchEventDetail(event.id)
      .then((loaded) => active && setDetail(loaded))
      .catch(() => active && setDetail(null));
    return () => {
      active = false;
    };
  }, [event.id]);
  return (
    <Modal title={event.title} onClose={onClose}>
      <Image className="detail-image" src={event.image} width={1024} height={768} alt={event.title} />
      <p className="detail-description">{detail === undefined ? 'Carregando…' : (detail?.description ?? 'Não foi possível carregar os detalhes.')}</p>
      <div className="detail-meta">
        <p>
          <CalendarDays />
          {event.fullDate} · {event.time}
        </p>
        <p>
          <MapPin />
          {event.venue} · {event.location}
        </p>
      </div>
      {detail && detail.tiers.length > 0 && (
        <ul className="detail-tiers">
          {detail.tiers.map((tier) => (
            <li key={tier.id}>
              <span>{tier.name}</span>
              <span>{formatPrice(Number(tier.price))}</span>
              <small>{tier.available > 0 ? `${tier.available} restantes` : 'Esgotado'}</small>
            </li>
          ))}
        </ul>
      )}
      <div className="purchase-row">
        <div>
          <small>A partir de</small>
          <strong>{event.price === null ? 'Em breve' : formatPrice(event.price)}</strong>
        </div>
        <Button variant="neon" onClick={() => setNotice('Prévia visual: a compra de ingressos ainda não está conectada.')}>
          Comprar ingresso
          <ArrowRight />
        </Button>
      </div>
      <Notice message={notice} />
    </Modal>
  );
}

export function TicketDialog({ event, holder, onClose }: { event: EventItem; holder: string; onClose: () => void }) {
  const [notice, setNotice] = useState('');
  return (
    <Modal title="Meus ingressos" onClose={onClose}>
      <div className="ticket-detail">
        <span className="confirmed">
          <Check />
          Ingressos de demonstração
        </span>
        <h3>{event.title}</h3>
        <p>
          {event.fullDate} · {event.time}
        </p>
        <p>
          {event.venue} · {event.location}
        </p>
        <div className="ticket-admission">
          <Ticket />
          <div>
            <strong>Pista · 2 ingressos</strong>
            <span>{holder}</span>
          </div>
        </div>
        <p className="ticket-demo-note">Exemplo visual · não válido para entrada.</p>
        <Button variant="outline" className="w-full" onClick={() => setNotice('O download estará disponível quando os ingressos reais forem conectados.')}>
          <ArrowDownToLine />
          Baixar ingressos
        </Button>
        <Notice message={notice} />
      </div>
    </Modal>
  );
}

export function ProfileDialog({ name, email, initials, onClose }: { name: string; email: string; initials: string; onClose: () => void }) {
  const [notice, setNotice] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setNotice('Prévia visual: nenhuma alteração foi salva.');
  };
  return (
    <Modal title="Meu perfil" onClose={onClose}>
      <form onSubmit={submit} className="account-form">
        <span className="profile-avatar avatar">{initials}</span>
        <label className="field-label">
          Nome
          <input className="login-input account-input" defaultValue={name} required />
        </label>
        <label className="field-label">
          E-mail
          <input className="login-input account-input" type="email" defaultValue={email} required />
        </label>
        <Button variant="neon" type="submit" className="w-full">
          Salvar alterações
        </Button>
        <Notice message={notice} />
      </form>
    </Modal>
  );
}

const passwordFields = [
  { label: 'Senha atual', autoComplete: 'current-password' },
  { label: 'Nova senha', autoComplete: 'new-password' },
  { label: 'Confirmar nova senha', autoComplete: 'new-password' },
];

export function PasswordDialog({ onClose }: { onClose: () => void }) {
  const [notice, setNotice] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setNotice('Prévia visual: nenhuma alteração foi salva.');
  };
  return (
    <Modal title="Troca de senha" onClose={onClose}>
      <form onSubmit={submit} className="account-form">
        {passwordFields.map(({ label, autoComplete }) => (
          <label className="field-label" key={label}>
            {label}
            <input type="password" className="login-input account-input" required autoComplete={autoComplete} />
          </label>
        ))}
        <Button variant="neon" type="submit" className="w-full">
          Alterar senha
        </Button>
        <Notice message={notice} />
      </form>
    </Modal>
  );
}
