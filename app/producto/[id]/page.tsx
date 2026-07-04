import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductDetail } from '@/components/product-detail'
import { formatPrice } from '@/lib/data'
import { supabase } from '@/lib/supabase'

function mapTallesToSizes(talles: unknown): string[] {
  if (!Array.isArray(talles)) return []

  const tallesCalzado = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] as const
  const tallesRopa = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
  const allowedTalles = [...tallesCalzado, ...tallesRopa] as const

  const uniqueTalles = Array.from(
    new Set(
      talles
        .map((talle) => String(talle).trim().toUpperCase())
        .filter((talle) => allowedTalles.includes(talle as (typeof allowedTalles)[number])),
    ),
  )

  return uniqueTalles.sort(
    (a, b) => allowedTalles.indexOf(a as (typeof allowedTalles)[number]) - allowedTalles.indexOf(b as (typeof allowedTalles)[number]),
  )
}

export async function generateStaticParams() {
  const { data: products, error } = await supabase.from('products').select('id')
  if (error || !products) return []
  return products.map((product: any) => ({ id: String(product.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (error || !product) {
    return { title: 'Producto no encontrado | Juanita Calzados' }
  }

  // Validar y parsear imagenes
  let imagenes: string[] = []
  if (Array.isArray(product.imagenes)) {
    imagenes = product.imagenes
  } else if (typeof product.imagenes === 'string') {
    try {
      imagenes = JSON.parse(product.imagenes)
    } catch {
      imagenes = []
    }
  }

  const mappedProduct = {
    id: String(product.id),
    slug: String(product.id),
    name: product.nombre,
    priceCard: product.precio_tarjeta,
    priceCash: product.precio_efectivo,
    sizes: mapTallesToSizes(product.talles),
    image: imagenes[0] ?? '',
    gallery: imagenes,
    description: product.descripcion ?? '',
    category: product.categoria ?? '',
  }

  return {
    title: `${mappedProduct.name} | Juanita Calzados`,
    description: mappedProduct.description,
    openGraph: {
      title: `${mappedProduct.name} - ${formatPrice(mappedProduct.priceCash)} en efectivo`,
      description: mappedProduct.description,
      images: [mappedProduct.image],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (error || !product) {
    notFound()
  }

  // Validar y parsear imagenes
  let imagenes: string[] = []
  if (Array.isArray(product.imagenes)) {
    imagenes = product.imagenes
  } else if (typeof product.imagenes === 'string') {
    try {
      imagenes = JSON.parse(product.imagenes)
    } catch {
      imagenes = []
    }
  }

  const mappedProduct = {
    id: String(product.id),
    slug: String(product.id),
    name: product.nombre,
    priceCard: product.precio_tarjeta,
    priceCash: product.precio_efectivo,
    sizes: mapTallesToSizes(product.talles),
    image: imagenes[0] ?? '',
    gallery: imagenes,
    description: product.descripcion ?? '',
    category: product.categoria ?? '',
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <ProductDetail product={mappedProduct} />
      </main>
      <SiteFooter />
    </div>
  )
}
