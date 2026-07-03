'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import { formatPrice, type Product, WHATSAPP_NUMBER } from '@/lib/data'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [size, setSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState(false)

  function handleAdd() {
    if (!size) {
      setError(true)
      return
    }
    addItem(product, size, quantity)
    setQuantity(1)
    setError(false)
  }

  function handleWhatsapp() {
    if (!size) {
      setError(true)
      return
    }
    setError(false)
    const message = `Hola, me interesa este producto:

Producto: ${product.name}
Talle: ${size}
Cantidad: ${quantity}
Precio: ${formatPrice(product.priceCash)} efectivo / ${formatPrice(product.priceCard)} tarjeta

¿Me pasás más información?`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="group flex flex-col border border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link
          href={`/producto/${product.id}`}
          aria-label={`Ver ${product.name}`}
          className="block size-full p-2"
        >
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          aria-label={`Agregar ${product.name} a favoritos`}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:text-primary"
        >
          <Heart className="size-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-[11px] font-semibold uppercase leading-tight text-foreground">
          <Link
            href={`/producto/${product.id}`}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm font-bold text-primary">
          {formatPrice(product.priceCard)}{' '}
          <span className="text-[10px] font-medium uppercase text-muted-foreground">
            tarjeta
          </span>
        </p>
        <p className="text-xs font-semibold text-foreground">
          {formatPrice(product.priceCash)}{' '}
          <span className="text-[10px] font-medium uppercase text-muted-foreground">
            efectivo
          </span>
        </p>

        {/* Size selector */}
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Talle
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s)
                  setError(false)
                }}
                aria-pressed={size === s}
                className={`flex h-7 min-w-7 items-center justify-center border px-1.5 text-[11px] font-semibold transition-colors ${
                  size === s
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-1 text-[10px] font-medium text-destructive">
              Elegí un talle
            </p>
          )}
        </div>

        {/* Quantity + add */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Restar cantidad"
              className="flex size-7 items-center justify-center text-foreground transition-colors hover:text-primary"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-xs font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Sumar cantidad"
              className="flex size-7 items-center justify-center text-foreground transition-colors hover:text-primary"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-none text-[10px] font-semibold uppercase tracking-widest"
        >
          <ShoppingBag className="size-3.5" />
          Agregar
        </Button>

        <button
          type="button"
          onClick={handleWhatsapp}
          className="mt-2 flex w-full items-center justify-center gap-1.5 border border-primary bg-transparent py-2 text-[10px] font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <MessageCircle className="size-3.5" />
          Consultar por WhatsApp
        </button>
      </div>
    </article>
  )
}
