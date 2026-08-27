import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-4 rounded-[18px] border border-espresso-100 bg-paper-white p-6 shadow-sm shadow-espresso-900/5', className)}
      {...props}
    />
  );
}

/** The title + description block every card on the dashboard opens with, `border-b` hairline
 *  included. Split from `Card` itself since a couple of cards (the growth charts) put a
 *  right-aligned figure in that header row instead of a plain title. */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b border-espresso-50 pb-3.5', className)} {...props} />;
}
