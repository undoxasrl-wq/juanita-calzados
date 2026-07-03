import Link from 'next/link'
import {
  MessageCircle,
  MapPin,
  Clock,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { InstagramIcon } from '@/components/instagram-icon'
import { business, getCategories, WHATSAPP_NUMBER } from '@/lib/data'

const info = [
  'Nosotros',
  'Envíos',
  'Cambios y devoluciones',
  'Preguntas frecuentes',
  'Guía de talles',
]

export async function SiteFooter() {
  const categories = await getCategories()

  return (
    <footer id="contacto" className="bg-accent">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo className="text-primary" size="sm" />
          <p className="mt-4 max-w-[200px] text-sm leading-relaxed text-muted-foreground">
            Moda, comodidad y tendencia en cada paso.
          </p>
          <div className="mt-4 flex gap-3 text-foreground">
            <a
              href={`https://instagram.com/${business.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-primary"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover:text-primary"
            >
              <MessageCircle className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
            Información
          </h3>
          <ul className="mt-4 space-y-2">
            {info.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
            Categorías
          </h3>
          <ul className="mt-4 space-y-2">
            {categories.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/categoria/${item.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 shrink-0 text-primary" />
              WhatsApp {business.phoneDisplay}
            </li>
            <li className="flex items-center gap-2">
              <InstagramIcon className="size-4 shrink-0 text-primary" />
              {business.instagram}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              {business.address}
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                {business.hours[0]}
                <br />
                {business.hours[1]}
                <br />
                {business.hours[2]}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
          © 2024 Juanita Calzados. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
