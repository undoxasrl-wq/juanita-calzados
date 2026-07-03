'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  X,
  ZoomIn,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import { formatPrice, WHATSAPP_NUMBER, type Product } from '@/lib/data'

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image]
  const [activeImage, setActiveImage] = useState(gallery[0])
  const [size, setSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const activeIndex = Math.max(0, gallery.indexOf(activeImage))

  function showRelative(step: number) {
    const next = (activeIndex + step + gallery.length) % gallery.length
    setActiveImage(gallery[next])
  }

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') showRelative(1)
      if (e.key === 'ArrowLeft') showRelative(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, activeIndex])

  function handleAdd() {
    if (!size) {
      setError(true)
      return false
    }
    addItem(product, size, quantity)
    setError(false)
    return true
  }

  function handleBuyWhatsapp() {
    if (!size) {
      setError(true)
      return
    }
    const lines = [
      '*Consulta de producto - Juanita Calzados*',
      '',
      `*Producto:* ${product.name}`,
      `*Talle:* ${size}`,
      `*Cantidad:* ${quantity}`,
      `*Precio efectivo:* ${formatPrice(product.priceCash)} c/u`,
      '',
      'Hola! Quiero comprar este producto.',
    ]
    const message = encodeURIComponent(lines.join('\n'))
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
    if (window.self !== window.top) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-xs uppercase tracking-wide text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          Inicio
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        Volver
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-4 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Ampliar imagen de ${product.name}`}
            className="group relative aspect-square flex-1 cursor-zoom-in overflow-hidden border border-border bg-secondary p-4"
          >
            <img
              src={activeImage || '/placeholder.svg'}
              alt={product.name}
              className="size-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <ZoomIn className="size-4" />
            </span>
          </button>
          <div className="flex gap-3 sm:flex-col">
            {gallery.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(img)}
                aria-label={`Ver imagen de ${product.name}`}
                aria-pressed={activeImage === img}
                className={`relative size-20 shrink-0 overflow-hidden border bg-secondary p-1.5 transition-colors ${
                  activeImage === img
                    ? 'border-primary'
                    : 'border-border hover:border-primary'
                }`}
              >
                <img
                  src={img || '/placeholder.svg'}
                  alt=""
                  className="size-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {product.category}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-5 space-y-1">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(product.priceCard)}{' '}
              <span className="text-xs font-medium uppercase text-muted-foreground">
                con tarjeta
              </span>
            </p>
            <p className="text-lg font-semibold text-foreground">
              {formatPrice(product.priceCash)}{' '}
              <span className="text-xs font-medium uppercase text-muted-foreground">
                en efectivo
              </span>
            </p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-foreground/80">
            {product.description}
          </p>

          {/* Sizes */}
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Talle
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s)
                    setError(false)
                  }}
                  aria-pressed={size === s}
                  className={`flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-semibold transition-colors ${
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
              <p className="mt-2 text-xs font-medium text-destructive">
                Elegí un talle para continuar
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cantidad
            </p>
            <div className="mt-2 flex w-fit items-center border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Restar cantidad"
                className="flex size-10 items-center justify-center text-foreground transition-colors hover:text-primary"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Sumar cantidad"
                className="flex size-10 items-center justify-center text-foreground transition-colors hover:text-primary"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-none text-xs font-semibold uppercase tracking-widest"
            >
              <ShoppingBag className="size-4" />
              Agregar al carrito
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleBuyWhatsapp}
              className="flex flex-1 items-center justify-center gap-2 rounded-none text-xs font-semibold uppercase tracking-widest"
            >
              <MessageCircle className="size-4" />
              Comprar por WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${product.name}`}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/85 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
          >
            <X className="size-5" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  showRelative(-1)
                }}
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  showRelative(1)
                }}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          <img
            src={activeImage || '/placeholder.svg'}
            alt={`${product.name} - vista ampliada`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[90vw] rounded-md object-contain shadow-2xl"
          />

          {gallery.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md"
            >
              {activeIndex + 1} / {gallery.length}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
