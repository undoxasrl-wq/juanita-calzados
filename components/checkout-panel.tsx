'use client'

import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/data'
import { PAYMENT_METHODS } from '@/lib/orders'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'

type SupabaseRpcError = {
  message?: string
  details?: string | null
  code?: string
  hint?: string | null
}

function formatRpcError(error: SupabaseRpcError | null) {
  if (!error) return 'Error desconocido.'

  const parts = [
    error.message,
    error.details,
    error.hint,
    error.code ? `Codigo: ${error.code}` : null,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' | ') : 'Error desconocido.'
}

export function CheckoutPanel() {
  const {
    items,
    total,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
  } = useCart()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [locality, setLocality] = useState('')
  const [observations, setObservations] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]>('WhatsApp')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    phone.trim() !== '' &&
    address.trim() !== '' &&
    locality.trim() !== '' &&
    items.length > 0 &&
    !isSubmitting

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    setErrorMessage(null)

    const orderPayload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      locality: locality.trim(),
      observations: observations.trim(),
      payment_method: paymentMethod,
      total_amount: total,
    }

    const itemsPayload = items.map((item) => ({
      product_id: Number.isNaN(Number(item.id)) ? null : Number(item.id),
      product_name: item.name,
      product_image: item.image || null,
      size: item.size,
      quantity: item.quantity,
      unit_price_cash: item.priceCash,
      unit_price_card: item.priceCard,
      subtotal_amount: item.priceCash * item.quantity,
    }))

    const { data: createdOrder, error } = await supabase
      .rpc('create_pedido_with_items', {
        order_payload: orderPayload,
        items_payload: itemsPayload,
      })
      .single()

    const createdOrderRow = createdOrder as Database['public']['Tables']['pedidos']['Row'] | null

    if (error || !createdOrderRow) {
      console.error('Supabase checkout RPC error:', error)
      setErrorMessage(`No se pudo registrar el pedido: ${formatRpcError(error as SupabaseRpcError)}`)
      setIsSubmitting(false)
      return
    }

    const lines: string[] = []
    lines.push('*Nuevo pedido - Juanita Calzados*')
    lines.push('')
    lines.push(`*Pedido:* ${createdOrderRow.order_number}`)
    lines.push(`*Nombre:* ${firstName.trim()} ${lastName.trim()}`)
    lines.push(`*WhatsApp:* ${phone.trim()}`)
    lines.push(`*Dirección:* ${address.trim()}`)
    lines.push(`*Localidad:* ${locality.trim()}`)
    lines.push(`*Forma de pago:* ${paymentMethod}`)
    if (observations.trim()) {
      lines.push(`*Observaciones:* ${observations.trim()}`)
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
    setFirstName('')
    setLastName('')
    setPhone('')
    setAddress('')
    setLocality('')
    setObservations('')
    setPaymentMethod('WhatsApp')
    setIsSubmitting(false)
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
              Completá tus datos para registrar el pedido y enviarte a WhatsApp el
              resumen para coordinar el pago y el envío.
            </p>

            {errorMessage ? (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
              <label
                htmlFor="checkout-first-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Nombre <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-first-name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

              <div>
                <label
                  htmlFor="checkout-last-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
                >
                  Apellido <span className="text-primary">*</span>
                </label>
                <input
                  id="checkout-last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="checkout-whatsapp"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Teléfono / WhatsApp <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-whatsapp"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Cód. de área + número"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-address"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Dirección <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección de envío"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-locality"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Localidad <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-locality"
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="Ciudad o localidad"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-payment-method"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Forma de pago <span className="text-primary">*</span>
              </label>
              <select
                id="checkout-payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as (typeof PAYMENT_METHODS)[number])}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="checkout-observations"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                Observaciones
              </label>
              <textarea
                id="checkout-observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Indicaciones para entrega, horario, referencia, etc."
                rows={3}
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
              {isSubmitting ? 'Registrando pedido...' : 'Enviar pedido por WhatsApp'}
            </Button>
          </footer>
        </form>
      </aside>
    </>
  )
}
