import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center space-y-6 px-5 py-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-espresso-950">Barbets Admin</h1>
        <p className="text-sm text-espresso-500">Sign in with your Barbets account. Only platform admins can get past this.</p>
      </div>
      <LoginForm />
    </main>
  );
}
