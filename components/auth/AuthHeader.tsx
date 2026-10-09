import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuthMode } from './AuthCard';

interface AuthHeaderProps {
  mode: AuthMode;
  onToggleMode: () => void;
}

export function AuthHeader({ mode, onToggleMode }: AuthHeaderProps) {
  return (
    <header className="login-header">
      <Link className="wordmark" href="/" aria-label="Nox, início">
        <Zap strokeWidth={2.2} />
        nox
        <span className="text-primary">.</span>
      </Link>
      <div className="flex items-center gap-2 text-xs">
        <span className="account-prompt text-muted-foreground">
          {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
        </span>
        <Button variant="ghost" size="sm" onClick={onToggleMode}>
          {mode === 'login' ? 'Criar conta' : 'Entrar'}
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </header>
  );
}
