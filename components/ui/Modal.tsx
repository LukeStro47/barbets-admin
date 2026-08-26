'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

/** Ported from the main app's components/ui/Modal.tsx — portal to document.body so `position:
 *  fixed` stays glued to the real viewport regardless of any ancestor's transform. */
export function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/40 px-5" onClick={onClose}>
      <div
        className={cn('w-full max-w-sm space-y-3 rounded-2xl bg-paper-white p-5 shadow-xl')}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
