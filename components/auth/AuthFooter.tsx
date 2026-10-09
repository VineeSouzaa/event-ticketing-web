import { ShieldCheck } from 'lucide-react';

export function AuthFooter() {
  return (
    <footer className="login-footer">
      <span>© 2026 Nox</span>
      <span className="connection-note">
        <ShieldCheck />
        Um novo jeito de se conectar.
      </span>
    </footer>
  );
}
