'use client';

import { useEffect } from 'react';
import { Compass, LockKeyhole, LogOut, Menu, Ticket, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/api/auth';

export type HomeView = 'discover' | 'tickets';

type Props = {
  open: boolean;
  view: HomeView;
  onToggle: () => void;
  onClose: () => void;
  onSelectView: (view: HomeView) => void;
  onOpenProfile: () => void;
  onOpenPassword: () => void;
};

export function EventSidebar({ open, view, onToggle, onClose, onSelectView, onOpenProfile, onOpenPassword }: Props) {
  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open, onClose]);

  const handleSignOut = async () => {
    await signOut();
    // Full navigation: drops all client state (and any cached authenticated pages).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('/login');
  };

  return (
    <>
      {open && <div className="menu-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`event-sidebar ${open ? 'is-open' : ''}`} aria-label="Menu principal">
        <Button variant="ghost" className="sidebar-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={onToggle} title="Menu">
          <Menu />
          <span>Menu</span>
        </Button>
        <nav className="sidebar-nav">
          <Button variant="ghost" className={`rail-item ${view === 'discover' ? 'active' : ''}`} title="Explorar eventos" onClick={() => onSelectView('discover')}>
            <Compass />
            <span>Explorar eventos</span>
          </Button>
          <Button variant="ghost" className={`rail-item ${view === 'tickets' ? 'active' : ''}`} title="Meus ingressos" onClick={() => onSelectView('tickets')}>
            <Ticket />
            <span>Meus ingressos</span>
          </Button>
          <div className="rail-divider" />
          <Button variant="ghost" className="rail-item" title="Meu perfil" onClick={onOpenProfile}>
            <UserRound />
            <span>Meu perfil</span>
          </Button>
          <Button variant="ghost" className="rail-item" title="Troca de senha" onClick={onOpenPassword}>
            <LockKeyhole />
            <span>Troca de senha</span>
          </Button>
        </nav>
        <div className="rail-bottom">
          <Button variant="ghost" className="rail-item" title="Sair" onClick={handleSignOut}>
            <LogOut />
            <span>Sair</span>
          </Button>
          <span className="rail-dot" />
        </div>
      </aside>
    </>
  );
}
