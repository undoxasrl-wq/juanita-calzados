export const ORDER_STATUSES = [
  'Pendiente',
  'Confirmado',
  'Preparando',
  'Enviado',
  'Entregado',
  'Cancelado',
] as const

export const PAYMENT_METHODS = ['WhatsApp', 'Transferencia', 'Efectivo', 'Tarjeta'] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export type OrderListItem = {
  id: number
  created_at: string
  order_number: string
  first_name: string
  last_name: string
  phone: string
  total_amount: number
  status: OrderStatus
  is_new: boolean
}

export type OrderDetailItem = {
  id: number
  product_id: number | null
  product_name: string
  product_image: string | null
  size: string
  quantity: number
  unit_price_cash: number
  unit_price_card: number
  subtotal_amount: number
}

export type OrderDetail = OrderListItem & {
  address: string
  locality: string
  observations: string | null
  payment_method: PaymentMethod | string
  order_items: OrderDetailItem[]
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}