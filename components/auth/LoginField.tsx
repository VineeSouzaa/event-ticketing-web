import type { InputHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  endAdornment?: ReactNode;
}

export function LoginField({ label, icon: Icon, endAdornment, id, className, ...inputProps }: LoginFieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="login-field">
        <Icon strokeWidth={1.6} />
        <input id={id} className={cn('login-input', className)} {...inputProps} />
        {endAdornment}
      </div>
    </div>
  );
}
