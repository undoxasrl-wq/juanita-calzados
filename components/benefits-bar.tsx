import { Truck, CreditCard, RefreshCw, MessageCircle } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'ENVÍOS A TODO EL PAÍS',
    sub: 'Coordinamos por WhatsApp',
  },
  {
    icon: CreditCard,
    title: '6 CUOTAS SIN INTERÉS',
    sub: 'Todos los medios de pago',
  },
  {
    icon: RefreshCw,
    title: 'CAMBIOS Y DEVOLUCIONES',
    sub: 'Hasta 30 días',
  },
  {
    icon: MessageCircle,
    title: 'ATENCIÓN PERSONALIZADA',
    sub: 'Por WhatsApp',
  },
]

export function BenefitsBar() {
  return (
    <section className="bg-accent">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="size-8 shrink-0 text-primary" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-xs font-semibold tracking-wide text-accent-foreground">
                {title}
              </p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
