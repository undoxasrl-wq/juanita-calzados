import { Truck, CreditCard, RefreshCw, MessageCircle } from 'lucide-react'

const items = [
  { icon: Truck, label: 'ENVÍOS A TODO EL PAÍS' },
  { icon: CreditCard, label: '6 CUOTAS SIN INTERÉS' },
  { icon: RefreshCw, label: 'CAMBIOS Y DEVOLUCIONES' },
  { icon: MessageCircle, label: 'ATENCIÓN PERSONALIZADA', sub: 'Por WhatsApp' },
]

export function AnnouncementBar() {
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-3 px-4 py-3 sm:grid-cols-4 sm:px-6">
        {items.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center justify-center gap-2">
            <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold tracking-wide sm:text-xs">
                {label}
              </p>
              {sub && <p className="text-[10px] opacity-80">{sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
