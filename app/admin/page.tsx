"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'
import DashboardCard from '@/components/admin/DashboardCard'
import ProductForm from '@/components/admin/ProductForm'
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
  talles: string[]
  descripcion: string
  imagenes: File[]
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

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const categoriesCount = useMemo(() => {
    return new Set(products.map((product) => product.categoria?.trim().toLowerCase())).size
  }, [products])

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      router.replace('/login')
      return
    }
    await loadProducts()
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
      setProducts((data ?? []) as AdminProduct[])
      setMessage(null)
    }
    setLoading(false)
  }

  async function handleSave(formData: FormData) {
    setLoading(true)
    const imagenes = formData.imagenes.length
      ? await Promise.all(formData.imagenes.map((file) => fileToDataUrl(file)))
      : selectedProduct?.imagenes ?? []

    const payload = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      subcategoria: formData.subcategoria || null,
      precio_efectivo: Number(formData.precioEfectivo),
      precio_tarjeta: Number(formData.precioTarjeta),
      talles: formData.talles,
      descripcion: formData.descripcion,
      imagenes,
      coleccion: selectedProduct?.coleccion ?? null,
    }

    if (selectedProduct) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', selectedProduct.id)

      if (error) {
        console.error(error)
        setMessage('Error al actualizar producto')
      } else {
        setMessage('Producto actualizado correctamente')
        setSelectedProduct(null)
      }
    } else {
      const { error } = await supabase.from('products').insert([payload])
      if (error) {
        console.error(error)
        setMessage('Error al crear producto')
      } else {
        setMessage('Producto creado correctamente')
      }
    }

    await loadProducts()
    setLoading(false)
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
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null)
      }
      setMessage('Producto eliminado correctamente')
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
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard titulo="Productos" valor={products.length} />
            <DashboardCard titulo="Categorías" valor={categoriesCount} />
            <DashboardCard titulo="Colecciones" valor={new Set(products.map((product) => product.coleccion?.trim().toLowerCase())).size} />
          </div>
          {message && (
            <div className="mb-4 rounded border border-slate-300 bg-white p-4 text-sm text-slate-700">
              {message}
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <section className="space-y-4">
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
