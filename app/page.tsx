import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { getSession } from '@/lib/api/session';

async function Greeting() {
  await connection();
  const user = await getSession();
  if (!user) redirect('/login');

  return (
    <>
      <h1 className="text-2xl font-semibold">Olá, {user.name}.</h1>
      <p className="text-muted-foreground">Sessão ativa como {user.email}.</p>
      <SignOutButton />
    </>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <Suspense fallback={<p className="text-muted-foreground">Carregando…</p>}>
        <Greeting />
      </Suspense>
    </main>
  );
}
