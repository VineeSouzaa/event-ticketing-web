import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Nox — Entre no seu espaço',
  description: 'Seu espaço Nox. Uma experiência de acesso simples e minimalista.',
  openGraph: {
    title: 'Nox — Entre no seu espaço',
    description: 'Seu espaço Nox. Uma experiência de acesso simples e minimalista.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function LoginPage() {
  return <AuthCard />;
}
