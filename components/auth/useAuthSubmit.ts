'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/api/auth';
import type { AuthMode } from './AuthCard';

const ERRORS: Record<number, string> = {
  400: 'Confira os dados informados.',
  401: 'E-mail ou senha inválidos.',
  409: 'Este e-mail já está cadastrado.',
  429: 'Muitas tentativas. Aguarde um minuto.',
};

export function useAuthSubmit(mode: AuthMode) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    try {
      const { response } =
        mode === 'signup'
          ? await signUp({ email, password, name: String(form.get('name')) })
          : await signIn({ email, password });

      if (!response.ok) {
        setError(ERRORS[response.status] ?? 'Algo deu errado. Tente novamente.');
        return;
      }
      // Next keeps the previous route's state alive; don't leave the password sitting in it.
      formElement.reset();
      router.push('/');
      router.refresh();
    } catch {
      setError('Não foi possível falar com o servidor.');
    } finally {
      setPending(false);
    }
  };

  return { submit, pending, error, clearError: () => setError('') };
}
