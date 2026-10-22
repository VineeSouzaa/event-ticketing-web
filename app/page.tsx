import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { EventHome } from '@/components/events/EventHome';
import { getEventsPage } from '@/lib/api/events.server';
import { getSession } from '@/lib/api/session';

async function AuthenticatedHome() {
  await connection();
  const user = await getSession();
  if (!user) redirect('/login');

  const initialPage = await getEventsPage();

  return <EventHome user={user} initialPage={initialPage} />;
}

export default function Home() {
  return (
    <Suspense fallback={<p className="p-6 text-muted-foreground">Carregando…</p>}>
      <AuthenticatedHome />
    </Suspense>
  );
}
