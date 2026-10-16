'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { ArrowRight, Fingerprint, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginField } from './LoginField';
import { PasswordField } from './PasswordField';
import { AuthHeader } from './AuthHeader';
import { AuthFooter } from './AuthFooter';
import { useAuthSubmit } from './useAuthSubmit';

export type AuthMode = 'login' | 'signup' | 'recovery';

const HEADING: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: 'Bom ter você de volta.',
    subtitle: 'Entre na sua conta e sinta-se em casa.',
  },
  signup: {
    title: 'Seu próximo começo.',
    subtitle: 'Crie sua conta. O espaço é seu.',
  },
  recovery: {
    title: 'Vamos recuperar seu acesso.',
    subtitle: 'Informe o e-mail associado à sua conta.',
  },
};

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [notice, setNotice] = useState('');

  const auth = useAuthSubmit(mode);

  const changeMode = (next: AuthMode) => {
    setMode(next);
    setNotice('');
    auth.clearError();
  };

  // Recovery has no backend endpoint yet.
  const previewRecovery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('A recuperação de senha ainda não está disponível.');
  };

  const submit = mode === 'recovery' ? previewRecovery : auth.submit;

  const heading = HEADING[mode];

  return (
    <div className="login-page">
      <Image
        className="wave-background"
        src="/neon-wave.jpg"
        width={1536}
        height={1024}
        alt=""
        aria-hidden="true"
        priority
      />

      <AuthHeader
        mode={mode}
        onToggleMode={() => changeMode(mode === 'login' ? 'signup' : 'login')}
      />

      <main className="login-main">
        <section className="login-form" aria-labelledby="login-title">
          <div className="login-emblem">
            <Fingerprint size={29} strokeWidth={1.5} />
          </div>
          <div className="login-heading">
            <h1 id="login-title">{heading.title}</h1>
            <p>{heading.subtitle}</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <LoginField
              label="E-mail"
              icon={Mail}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              required
            />

            {mode === 'signup' && (
              <LoginField
                label="Nome"
                icon={User}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                required
              />
            )}

            {mode !== 'recovery' && (
              <PasswordField
                id="password"
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
                placeholder={
                  mode === 'signup' ? 'Mínimo de 12 caracteres' : 'Digite sua senha'
                }
              />
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    name="remember"
                    className="size-3.5 accent-primary"
                  />
                  Lembrar de mim
                </label>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs text-foreground"
                  onClick={() => changeMode('recovery')}
                >
                  Esqueceu a senha?
                </Button>
              </div>
            )}

            <Button
              variant="neon"
              type="submit"
              disabled={auth.pending}
              className="h-50px w-full justify-between px-5 text-sm font-semibold"
            >
              <span className="w-4" aria-hidden="true" />
              {mode === 'login'
                ? 'Entrar'
                : mode === 'signup'
                  ? 'Criar conta'
                  : 'Enviar link de recuperação'}
              <ArrowRight />
            </Button>
          </form>

          {mode !== 'recovery' ? (
            <>
              <div className="login-divider">ou continue com</div>
              <Button
                variant="social"
                className="h-50px w-full"
                onClick={() =>
                  setNotice(
                    'O acesso com Google ainda não está disponível.',
                  )
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
                  <path
                    fill="currentColor"
                    d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.3 2.9-7.4ZM12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H2.9v2.6A10 10 0 0 0 12 22ZM6.3 13.9a6 6 0 0 1 0-3.8V7.5H2.9a10 10 0 0 0 0 9l3.4-2.6ZM12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-9.1 5.5l3.4 2.6C7.1 7.7 9.4 5.9 12 5.9Z"
                  />
                </svg>
                Google
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className="mt-5 w-full text-muted-foreground"
              onClick={() => changeMode('login')}
            >
              Voltar para o login
            </Button>
          )}

          {(auth.error || notice) && (
            <p role="status" className="form-notice">
              {auth.error || notice}
            </p>
          )}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Seu espaço, em outra frequência.
          </p>
        </section>
      </main>

      <AuthFooter />
    </div>
  );
}
