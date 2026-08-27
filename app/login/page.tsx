import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-espresso-950">
      <div className="pointer-events-none absolute top-[-120px] left-[-160px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,163,61,0.22)_0%,rgba(232,163,61,0)_70%)]" />
      <main className="relative mx-auto flex h-full min-h-dvh max-w-[400px] flex-col justify-center gap-8 px-5 py-8">
        <div className="flex flex-col gap-[18px]">
          <Image src="/barbets-mono-white.png" alt="" width={56} height={56} className="block" />
          <div>
            <h1 className="mb-1.5 text-[36px] leading-[1.05] font-extrabold tracking-[-0.03em] text-paper-white">Barbets Admin</h1>
            <p className="text-[15px] leading-[1.55] text-espresso-300">Sign in with your Barbets account. Only platform admins can get past this.</p>
          </div>
        </div>
        <LoginForm />
      </main>
    </div>
  );
}
