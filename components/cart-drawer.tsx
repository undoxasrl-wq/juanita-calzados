'use client'

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import { formatPrice } from '@/lib/data'

export function CartDrawer() {
  const {
    items,
    total,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    openCheckout,
  } = useCart()

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!isCartOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
            <ShoppingBag className="size-5 text-primary" />
            Tu carrito
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <X className="size-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Tu carrito está vacío.
            </p>
            <Button
              variant="outline"
              onClick={closeCart}
              className="rounded-none text-xs font-semibold uppercase tracking-widest"
            >
              Seguir comprando
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 py-4"
                >
                  <div className="size-20 shrink-0 overflow-hidden bg-secondary">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-semibold uppercase leading-tight text-foreground">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        aria-label={`Eliminar ${item.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                      Talle {item.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          aria-label="Restar cantidad"
                          className="flex size-7 items-center justify-center text-foreground transition-colors hover:text-primary"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                          aria-label="Sumar cantidad"
                          className="flex size-7 items-center justify-center text-foreground transition-colors hover:text-primary"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(item.priceCash * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold uppercase tracking-wide text-foreground">
                  Total
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Precio efectivo / transferencia
              </p>
              <Button
                onClick={openCheckout}
                size="lg"
                className="mt-4 w-full rounded-none text-xs font-semibold uppercase tracking-widest"
              >
                Finalizar compra
              </Button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
