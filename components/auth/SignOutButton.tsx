'use client';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/api/auth';

export function SignOutButton() {
  const handleClick = async () => {
    await signOut();
    // Full navigation: drops all client state (and any cached authenticated pages).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('/login');
  };

  return (
    <Button variant="neon" onClick={handleClick}>
      Sair
    </Button>
  );
}
