'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '@/lib/data'

export type CartItem = {
  id: string
  name: string
  image: string
  size: string
  quantity: number
  priceCash: number
  priceCard: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  isCartOpen: boolean
  isCheckoutOpen: boolean
  addItem: (product: Product, size: string, quantity: number) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function lineKey(id: string, size: string) {
  return `${id}__${size}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setCartOpen] = useState(false)
  const [isCheckoutOpen, setCheckoutOpen] = useState(false)

  const addItem = useCallback(
    (product: Product, size: string, quantity: number) => {
      setItems((prev) => {
        const key = lineKey(product.id, size)
        const existing = prev.find((i) => lineKey(i.id, i.size) === key)
        if (existing) {
          return prev.map((i) =>
            lineKey(i.id, i.size) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            size,
            quantity,
            priceCash: product.priceCash,
            priceCard: product.priceCard,
          },
        ]
      })
      setCartOpen(true)
    },
    [],
  )

  const removeItem = useCallback((id: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => lineKey(i.id, i.size) !== lineKey(id, size)),
    )
  }, [])

  const updateQuantity = useCallback(
    (id: string, size: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            lineKey(i.id, i.size) === lineKey(id, size)
              ? { ...i, quantity }
              : i,
          )
          .filter((i) => i.quantity > 0),
      )
    },
    [],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCash * i.quantity, 0),
    [items],
  )

  const value: CartContextValue = {
    items,
    count,
    total,
    isCartOpen,
    isCheckoutOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    openCheckout: () => {
      setCartOpen(false)
      setCheckoutOpen(true)
    },
    closeCheckout: () => setCheckoutOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
