'use client'

import Link from 'next/link'
import { Search, User, ShoppingBag } from 'lucide-react'
import { navLinks } from '@/lib/data'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart-provider'

export function SiteHeader() {
  const { count, openCart } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-4">
        <Link
          href="/"
          aria-label="Juanita Calzados - Inicio"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shrink-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0"
        >
          <Logo className="text-primary" />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 lg:flex"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                i === 0 ? 'text-primary' : 'text-foreground'
              }`}
            >
              {link.label}
              {i === 0 && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 text-foreground sm:gap-5 lg:ml-0">
          <button
            type="button"
            aria-label="Buscar"
            className="hidden transition-colors hover:text-primary sm:block"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Mi cuenta"
            className="hidden transition-colors hover:text-primary sm:block"
          >
            <User className="size-5" />
          </button>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Carrito de compras, ${count} ${count === 1 ? 'producto' : 'productos'}`}
            className="relative transition-colors hover:text-primary"
          >
            <ShoppingBag className="size-5" />
            <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
