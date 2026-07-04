'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'
import DashboardCard from '@/components/admin/DashboardCard'
import { ORDER_STATUSES, type OrderDetail, type OrderListItem, type OrderStatus, formatOrderDate } from '@/lib/orders'
import { formatPrice } from '@/lib/data'
import { supabase } from '@/lib/supabase'

type OrderItemRow = {
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

type OrderDetailRow = {
  id: number
  created_at: string
  order_number: string
  first_name: string
  last_name: string
  phone: string
  address: string
  locality: string
  observations: string | null
  payment_method: string
  status: string
  total_amount: number
  is_new: boolean
  pedido_items: OrderItemRow[] | null
}

function statusClasses(status: OrderStatus) {
  switch (status) {
    case 'Pendiente':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'Confirmado':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    case 'Preparando':
      return 'border-violet-200 bg-violet-50 text-violet-700'
    case 'Enviado':
      return 'border-indigo-200 bg-indigo-50 text-indigo-700'
    case 'Entregado':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'Cancelado':
      return 'border-red-200 bg-red-50 text-red-700'
  }
}

function mapOrderDetail(order: OrderDetailRow): OrderDetail {
  return {
    id: order.id,
    created_at: order.created_at,
    order_number: order.order_number,
    first_name: order.first_name,
    last_name: order.last_name,
    phone: order.phone,
    address: order.address,
    locality: order.locality,
    observations: order.observations,
    payment_method: order.payment_method,
    status: order.status as OrderStatus,
    total_amount: order.total_amount,
    is_new: order.is_new,
    order_items: (order.pedido_items ?? []).map((item) => ({
      ...item,
      unit_price_cash: Number(item.unit_price_cash),
      unit_price_card: Number(item.unit_price_card),
      subtotal_amount: Number(item.subtotal_amount),
    })),
  }
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  useEffect(() => {
    void checkSession()
  }, [])

  async function checkSession() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      router.replace('/login')
      return
    }

    await loadOrders()
  }

  async function loadOrders(selectedId?: number) {
    setLoading(true)
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, created_at, order_number, first_name, last_name, phone, total_amount, status, is_new')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setOrders([])
      setMessage('Error cargando pedidos')
      setLoading(false)
      return
    }

    const nextOrders = (data ?? []).map((order) => ({
      ...order,
      total_amount: Number(order.total_amount),
      status: order.status as OrderStatus,
    })) as OrderListItem[]

    setOrders(nextOrders)
    setNewOrdersCount(nextOrders.filter((order) => order.is_new).length)
    setMessage(null)
    setLoading(false)

    const orderToOpen = selectedId ?? selectedOrder?.id ?? nextOrders[0]?.id
    if (orderToOpen) {
      await loadOrderDetail(orderToOpen, selectedId !== undefined)
    } else {
      setSelectedOrder(null)
    }
  }

  async function loadOrderDetail(orderId: number, markAsRead: boolean) {
    setDetailLoading(true)

    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        id,
        created_at,
        order_number,
        first_name,
        last_name,
        phone,
        address,
        locality,
        observations,
        payment_method,
        status,
        total_amount,
        is_new,
        pedido_items (
          id,
          product_id,
          product_name,
          product_image,
          size,
          quantity,
          unit_price_cash,
          unit_price_card,
          subtotal_amount
        )
      `)
      .eq('id', orderId)
      .single()

    if (error || !data) {
      console.error(error)
      setMessage('Error cargando el detalle del pedido')
      setDetailLoading(false)
      return
    }

    const mapped = mapOrderDetail(data as OrderDetailRow)
    setSelectedOrder(mapped)
    setDetailLoading(false)

    if (markAsRead && mapped.is_new) {
      const { error: markError } = await supabase
        .from('pedidos')
        .update({ is_new: false })
        .eq('id', orderId)

      if (markError) {
        console.error(markError)
        return
      }

      setSelectedOrder((prev) => prev ? { ...prev, is_new: false } : prev)
      setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, is_new: false } : order))
      setNewOrdersCount((prev) => Math.max(prev - 1, 0))
    }
  }

  async function handleStatusChange(orderId: number, nextStatus: OrderStatus) {
    const { error } = await supabase
      .from('pedidos')
      .update({ status: nextStatus, is_new: false })
      .eq('id', orderId)

    if (error) {
      console.error(error)
      setMessage('No se pudo actualizar el estado del pedido')
      return
    }

    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: nextStatus, is_new: false } : order))
    setSelectedOrder((prev) => prev ? { ...prev, status: nextStatus, is_new: false } : prev)
    setNewOrdersCount((prev) => {
      const wasNew = orders.find((order) => order.id === orderId)?.is_new
      return wasNew ? Math.max(prev - 1, 0) : prev
    })
    setMessage('Estado actualizado correctamente')
  }

  async function handleDelete(orderId: number) {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.')
    if (!confirmed) return

    const deletedOrder = orders.find((order) => order.id === orderId)
    const { error } = await supabase.from('pedidos').delete().eq('id', orderId)

    if (error) {
      console.error(error)
      setMessage('No se pudo eliminar el pedido')
      return
    }

    const nextOrders = orders.filter((order) => order.id !== orderId)
    setOrders(nextOrders)
    if (deletedOrder?.is_new) {
      setNewOrdersCount((prev) => Math.max(prev - 1, 0))
    }

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null)
      const nextSelectedId = nextOrders[0]?.id
      if (nextSelectedId) {
        await loadOrderDetail(nextSelectedId, false)
      }
    }

    setMessage('Pedido eliminado correctamente')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const pendingCount = orders.filter((order) => order.status === 'Pendiente').length

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onSignOut={handleSignOut} />
      <div className="flex">
        <Sidebar newOrdersCount={newOrdersCount} />
        <main className="flex-1 p-6">
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard titulo="Pedidos" valor={orders.length} />
            <DashboardCard titulo="Nuevos" valor={newOrdersCount} />
            <DashboardCard titulo="Pendientes" valor={pendingCount} />
          </div>

          {message ? (
            <div className="mb-4 rounded border border-slate-300 bg-white p-4 text-sm text-slate-700">
              {message}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Listado de pedidos</h2>
                  <p className="text-sm text-slate-500">Los pedidos nuevos se identifican con un punto rosa.</p>
                </div>
              </div>

              {loading ? (
                <p>Cargando pedidos...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-600">
                        <th className="px-3 py-2">Pedido</th>
                        <th className="px-3 py-2">Fecha</th>
                        <th className="px-3 py-2">Cliente</th>
                        <th className="px-3 py-2">Teléfono</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Estado</th>
                        <th className="px-3 py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-slate-200 last:border-none">
                          <td className="px-3 py-3 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{order.order_number}</span>
                              {order.is_new ? <span className="size-2 rounded-full bg-rose-500" aria-label="Pedido nuevo" /> : null}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-slate-600">{formatOrderDate(order.created_at)}</td>
                          <td className="px-3 py-3">{order.first_name} {order.last_name}</td>
                          <td className="px-3 py-3">{order.phone}</td>
                          <td className="px-3 py-3 font-medium">{formatPrice(order.total_amount)}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => loadOrderDetail(order.id, true)}
                                className="rounded border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
                              >
                                Ver detalle
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(order.id)}
                                className="rounded border border-red-300 bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-3 py-4 text-slate-500">
                            No hay pedidos cargados.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Detalle del pedido</h2>
                  <p className="text-sm text-slate-500">Revisá la información completa y actualizá el estado.</p>
                </div>
                {selectedOrder ? (
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>

              {detailLoading ? (
                <p>Cargando detalle...</p>
              ) : selectedOrder ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pedido</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{selectedOrder.order_number}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatOrderDate(selectedOrder.created_at)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total final</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{formatPrice(selectedOrder.total_amount)}</p>
                      <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre y apellido</p>
                      <p className="mt-1 text-sm text-slate-900">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Teléfono</p>
                      <p className="mt-1 text-sm text-slate-900">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dirección</p>
                      <p className="mt-1 text-sm text-slate-900">{selectedOrder.address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Localidad</p>
                      <p className="mt-1 text-sm text-slate-900">{selectedOrder.locality}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Forma de pago</p>
                      <p className="mt-1 text-sm text-slate-900">{selectedOrder.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Observaciones</p>
                      <p className="mt-1 text-sm text-slate-900">{selectedOrder.observations || 'Sin observaciones'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Productos</h3>
                    <div className="space-y-3">
                      {selectedOrder.order_items.map((item) => (
                        <div key={item.id} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-slate-100">
                            {item.product_image ? (
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-slate-400">Sin imagen</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-slate-900">{item.product_name}</p>
                                <p className="mt-1 text-sm text-slate-600">Talle: {item.size}</p>
                                <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                                <p className="text-sm text-slate-600">Precio: {formatPrice(item.unit_price_cash)}</p>
                              </div>
                              <p className="text-sm font-semibold text-slate-900">Subtotal: {formatPrice(item.subtotal_amount)}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {selectedOrder.order_items.length === 0 ? (
                        <p className="text-sm text-slate-500">Este pedido no tiene productos asociados.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Seleccioná un pedido para ver su detalle.</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}