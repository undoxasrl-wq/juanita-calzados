"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'
import DashboardCard from '@/components/admin/DashboardCard'
import ProductForm from '@/components/admin/ProductForm'
import { MAIN_CATEGORIES } from '@/lib/data'
import { supabase } from '@/lib/supabase'

type AdminProduct = {
  id: number
  nombre: string
  categoria: string
  subcategoria?: string | null
  precio_efectivo: number
  precio_tarjeta: number
  talles: string[]
  descripcion: string
  imagenes: string[]
  coleccion?: string | null
}

type FormData = {
  nombre: string
  categoria: string
  subcategoria: string
  precioEfectivo: string
  precioTarjeta: string
  tipoTalles: 'calzado' | 'ropa'
  talles: string[]
  descripcion: string
  imagenes: File[]
}

const TALLES_CALZADO = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] as const
const TALLES_ROPA = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
const ORDEN_TALLES = [...TALLES_CALZADO, ...TALLES_ROPA] as const

function normalizeTalles(value: unknown, tipoTalles?: 'calzado' | 'ropa'): string[] {
  if (!Array.isArray(value)) return []

  const allowedTalles: readonly string[] = tipoTalles === 'ropa' ? TALLES_ROPA : tipoTalles === 'calzado' ? TALLES_CALZADO : ORDEN_TALLES
  const allowedTallesSet = new Set(allowedTalles)

  const uniqueTalles = Array.from(
    new Set(
      value
        .map((talle) => String(talle).trim().toUpperCase())
        .filter((talle) => allowedTallesSet.has(talle)),
    ),
  )

  return uniqueTalles.sort(
    (a, b) => ORDEN_TALLES.indexOf(a as (typeof ORDEN_TALLES)[number]) - ORDEN_TALLES.indexOf(b as (typeof ORDEN_TALLES)[number]),
  )
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function normalizeCounterValue(value: string | null | undefined) {
  return String(value ?? '').trim().toLowerCase()
}

function formatSupabaseError(error: { message?: string; details?: string | null; code?: string } | null) {
  if (!error) return 'Error desconocido de Supabase'

  const parts = [error.message, error.details, error.code ? `Código: ${error.code}` : null].filter(Boolean)
  return parts.length > 0 ? parts.join(' | ') : 'Error desconocido de Supabase'
}

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  useEffect(() => {
    void checkSession()

    const channel = supabase
      .channel('admin-products-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          void loadProducts()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  const dashboardStats = useMemo(() => {
    const collections = new Set(products.map((product) => product.coleccion?.trim().toLowerCase()))

    return {
      products: products.length,
      categories: MAIN_CATEGORIES.length,
      collections: collections.size,
    }
  }, [products])

  async function checkSession() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      router.replace('/login')
      return
    }
    await Promise.all([loadProducts(), loadNewOrdersCount()])
  }

  async function loadNewOrdersCount() {
    const { count, error } = await supabase
      .from('pedidos')
      .select('id', { count: 'exact', head: true })
      .eq('is_new', true)

    if (error) {
      console.error(error)
      setNewOrdersCount(0)
      return
    }

    setNewOrdersCount(count ?? 0)
  }

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setMessage('Error cargando productos')
      setProducts([])
    } else {
      const normalizedProducts = (data ?? []).map((product) => ({
        ...(product as AdminProduct),
        talles: normalizeTalles((product as AdminProduct).talles),
      }))
      setProducts(normalizedProducts as AdminProduct[])
      setMessage(null)
    }
    setLoading(false)
  }

  async function handleSave(formData: FormData) {
    setLoading(true)

    try {
      const imagenes = formData.imagenes.length
        ? await Promise.all(formData.imagenes.map((file) => fileToDataUrl(file)))
        : selectedProduct?.imagenes ?? []

      const basePayload = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        subcategoria: formData.subcategoria || null,
        precio_efectivo: Number(formData.precioEfectivo),
        precio_tarjeta: Number(formData.precioTarjeta),
        talles: normalizeTalles(formData.talles, formData.tipoTalles),
        descripcion: formData.descripcion,
        imagenes,
      }

      if (selectedProduct) {
        const updatePayload = {
          ...basePayload,
          coleccion: selectedProduct?.coleccion ?? null,
        }

        const { error } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', selectedProduct.id)

        if (error) {
          console.error('Supabase update error:', error)
          setMessage(`Error al actualizar producto: ${formatSupabaseError(error)}`)
          return
        }

        setMessage('Producto actualizado correctamente')
        setSelectedProduct(null)
      } else {
        const { error } = await supabase.from('products').insert([basePayload])

        if (error) {
          console.error('Supabase insert error:', error)
          setMessage(`Error al crear producto: ${formatSupabaseError(error)}`)
          return
        }

        setMessage('Producto creado correctamente')
      }

      await loadProducts()
    } catch (error) {
      console.error('Unexpected product save error:', error)
      setMessage(
        `Error inesperado al guardar producto: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  function handleEdit(product: AdminProduct) {
    setSelectedProduct(product)
    setMessage(null)
  }

  async function handleDelete(productId: number) {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')
    if (!confirmed) return

    setLoading(true)
    const { error } = await supabase.from('products').delete().eq('id', productId)

    if (error) {
      console.error(error)
      setMessage('Error al eliminar producto')
    } else {
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null)
      }
      setMessage('Producto eliminado correctamente')
      await loadProducts()
    }
    setLoading(false)
  }

  function handleCancel() {
    setSelectedProduct(null)
    setMessage(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onSignOut={handleSignOut} />
      <div className="flex">
        <Sidebar newOrdersCount={newOrdersCount} />
        <main className="flex-1 p-6">
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard titulo="Productos" valor={dashboardStats.products} />
            <DashboardCard titulo="Categorías" valor={dashboardStats.categories} />
            <DashboardCard titulo="Colecciones" valor={dashboardStats.collections} />
          </div>
          {message && (
            <div className="mb-4 rounded border border-slate-300 bg-white p-4 text-sm text-slate-700">
              {message}
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <section id="productos" className="space-y-4">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Listado de productos</h2>
                {loading ? (
                  <p>Cargando productos...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-600">
                          <th className="px-3 py-2">Nombre</th>
                          <th className="px-3 py-2">Categoría</th>
                          <th className="px-3 py-2">Precio Efectivo</th>
                          <th className="px-3 py-2">Precio Tarjeta</th>
                          <th className="px-3 py-2">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-slate-200 last:border-none">
                            <td className="px-3 py-2">{product.nombre}</td>
                            <td className="px-3 py-2">{product.categoria}</td>
                            <td className="px-3 py-2">${product.precio_efectivo.toLocaleString('es-AR')}</td>
                            <td className="px-3 py-2">${product.precio_tarjeta.toLocaleString('es-AR')}</td>
                            <td className="px-3 py-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(product)}
                                className="rounded border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(product.id)}
                                className="rounded border border-red-300 bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-3 py-4 text-slate-500">
                              No hay productos cargados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
            <section>
              <ProductForm
                key={selectedProduct?.id ?? 'new-product'}
                initialData={selectedProduct ? {
                  ...selectedProduct,
                  precio: `$${selectedProduct.precio_efectivo.toLocaleString('es-AR')}`,
                } : undefined}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
