'use client';

import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginField } from './LoginField';

interface PasswordFieldProps {
  id: string;
  autoComplete: 'current-password' | 'new-password';
  placeholder: string;
}

export function PasswordField({ id, autoComplete, placeholder }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <LoginField
      label="Senha"
      icon={LockKeyhole}
      id={id}
      name={id}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      placeholder={placeholder}
      minLength={6}
      required
      endAdornment={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="password-toggle"
          title={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      }
    />
  );
}
