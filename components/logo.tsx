import { cn } from '@/lib/utils'

export function Logo({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <img
      src="/logo-juanita.png"
      alt="Juanita by Ailén Saita"
      className={cn(
        'w-auto object-contain mix-blend-multiply',
        size === 'md' ? 'h-14 sm:h-16 lg:h-20' : 'h-12 sm:h-14',
        className,
      )}
    />
  )
}
