'use client'

import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/data'

export function CheckoutPanel() {
  const {
    items,
    total,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
  } = useCart()

  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')

  const canSubmit = name.trim() !== '' && whatsapp.trim() !== '' && items.length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    const lines: string[] = []
    lines.push('*Nuevo pedido - Juanita Calzados*')
    lines.push('')
    lines.push(`*Nombre:* ${name.trim()}`)
    lines.push(`*WhatsApp:* ${whatsapp.trim()}`)
    if (address.trim()) {
      lines.push(`*Dirección:* ${address.trim()}`)
    }
    lines.push('')
    lines.push('*Pedido:*')
    items.forEach((item) => {
      lines.push(
        `• ${item.name} | Talle ${item.size} | x${item.quantity} | ${formatPrice(
          item.priceCash,
        )} c/u = ${formatPrice(item.priceCash * item.quantity)}`,
      )
    })
    lines.push('')
    lines.push(`*Total: ${formatPrice(total)}*`)

    const message = encodeURIComponent(lines.join('\n'))
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

    if (window.self !== window.top) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }

    clearCart()
    closeCheckout()
    setName('')
    setWhatsapp('')
    setAddress('')
  }

  return (
    <>
      <div
        aria-hidden={!isCheckoutOpen}
        onClick={closeCheckout}
        className={`fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCheckoutOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-label="Finalizar compra"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300 ${
          isCheckoutOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
            Finalizar compra
          </h2>
          <button
            type="button"
            onClick={closeCheckout}
            aria-label="Cerrar checkout"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <X className="size-5" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-5 px-5 py-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Completá tus datos y te enviamos a WhatsApp el resumen del pedido
              para coordinar el pago y el envío.
            </p>

            <div>
              <label
                htmlFor="checkout-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Nombre completo <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre y apellido"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-whatsapp"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                WhatsApp <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Cód. de área + número"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-address"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Dirección{' '}
                <span className="font-normal normal-case text-muted-foreground">
                  (opcional)
                </span>
              </label>
              <input
                id="checkout-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección de envío"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="border border-border bg-secondary/50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Resumen
              </h3>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between gap-2 text-xs text-muted-foreground"
                  >
                    <span>
                      {item.name} (T{item.size}) x{item.quantity}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(item.priceCash * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                  Total
                </span>
                <span className="text-base font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <footer className="border-t border-border px-5 py-4">
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-none text-xs font-semibold uppercase tracking-widest disabled:opacity-50"
            >
              <MessageCircle className="size-4" />
              Enviar pedido por WhatsApp
            </Button>
          </footer>
        </form>
      </aside>
    </>
  )
}
