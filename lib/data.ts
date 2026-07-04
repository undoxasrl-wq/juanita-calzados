import { getProducts } from "./products"

export type Category = {
  name: string
  slug: string
  image: string
}

export type Product = {
  id: string
  slug: string
  name: string
  priceCard: number
  priceCash: number
  sizes: string[]
  image: string
  gallery: string[]
  description: string
  category: string
  subcategoria?: string
}

export const MAIN_CATEGORIES = [
  'Botas',
  'Sandalias',
  'Vestidos',
  'Pantalones',
  'Abrigos',
  'Sobres de Fiesta',
] as const

export const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  Botas: ['Texanas', 'Bucaneras', 'Borcegos', 'Western', 'Flecos'],
  Sandalias: ['Plataforma', 'Chatitas', 'Taco alto', 'Taco bajo'],
  Vestidos: ['Cortos', 'Largos', 'Fiesta', 'Casual'],
  Pantalones: ['Jean', 'Vestir', 'Cargo', 'Palazzo'],
  Abrigos: ['Tapados', 'Camperas', 'Blazers', 'Chalecos'],
  'Sobres de Fiesta': [],
}

const MAIN_CATEGORY_LOOKUP = new Map(
  MAIN_CATEGORIES.map((category) => [normalizeText(category), category]),
)

const SUBCATEGORY_TO_MAIN_CATEGORY = new Map<string, string>()

for (const [mainCategory, subcategories] of Object.entries(SUBCATEGORIES_BY_CATEGORY)) {
  for (const subcategory of subcategories) {
    const normalizedSubcategory = normalizeText(subcategory)
    if (!SUBCATEGORY_TO_MAIN_CATEGORY.has(normalizedSubcategory)) {
      SUBCATEGORY_TO_MAIN_CATEGORY.set(normalizedSubcategory, mainCategory)
    }
  }
}

export const WHATSAPP_NUMBER = '5492262518583'

export const business = {
  address: 'Calle 59 Nº 2753',
  phone: '2262518583',
  phoneDisplay: '2262 518583',
  instagram: '@juanitacalzadosok',
  hours: ['Lunes a sábado', '10:00 a 13:00', '16:30 a 20:00'],
}

const categoryImages: Record<string, string> = {
  botas: '/kalei-dos-en-uno.jpg',
  sandalias: '/sandalias.png',
  vestidos: '/vestido.png',
  pantalones: '/pantalones.png',
  abrigos: '/abrigos.png',
  'sobres de fiesta': '/sobredefiestas.png',
  botinetas: '/bota-aura-chocolate.jpg',
  texanas: '/texana-cataleya.jpg',
  borcegos: '/jalei-chocolate.jpg',
  flecos: '/bota-tokio-flecos.jpg',
  western: '/bota-western-marron.jpg',
  accesorios: '/bota-aura-detalle.jpg',
}

function slugifyCategory(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeText(value: string) {
  return String(value ?? '').trim().toLowerCase()
}

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

function getCategoryImage(name: string) {
  const normalizedName = name.trim().toLowerCase()
  return categoryImages[normalizedName] ?? '/placeholder.svg'
}

function getMainCategoryFromProduct(product: { categoria?: string | null; subcategoria?: string | null }) {
  const categoria = normalizeText(product.categoria ?? '')
  const subcategoria = normalizeText(product.subcategoria ?? '')

  if (MAIN_CATEGORY_LOOKUP.has(categoria)) {
    return MAIN_CATEGORY_LOOKUP.get(categoria) ?? null
  }

  if (SUBCATEGORY_TO_MAIN_CATEGORY.has(categoria)) {
    return SUBCATEGORY_TO_MAIN_CATEGORY.get(categoria) ?? null
  }

  if (SUBCATEGORY_TO_MAIN_CATEGORY.has(subcategoria)) {
    return SUBCATEGORY_TO_MAIN_CATEGORY.get(subcategoria) ?? null
  }

  return null
}

export async function getCategories(): Promise<Category[]> {
  const products = await getProducts()

  const categoryImagesFromProducts = new Map<string, string>()

  ;(products as Array<any> || []).forEach((product) => {
    const mainCategory = getMainCategoryFromProduct(product)
    if (!mainCategory) return

    const normalizedName = normalizeText(mainCategory)

    if (!normalizedName || categoryImagesFromProducts.has(normalizedName)) {
      return
    }

    const imagenes = Array.isArray(product.imagenes)
      ? product.imagenes
      : typeof product.imagenes === 'string'
        ? (() => {
            try {
              return JSON.parse(product.imagenes)
            } catch {
              return []
            }
          })()
        : []

    const firstImage = imagenes[0] ?? ''
    categoryImagesFromProducts.set(normalizedName, firstImage)
  })

  const categories: Category[] = MAIN_CATEGORIES.map((name) => {
      const imageFromProduct = categoryImagesFromProducts.get(normalizeText(name))
      return {
        name,
        slug: slugifyCategory(name),
        image: imageFromProduct || getCategoryImage(name),
      }
    })
    .filter((category) => category.slug)

  return categories
}

export const featuredProducts: Product[] = [
  {
  id: "dynamic",
  slug: "dynamic",
  name: "Productos",
  priceCard: 0,
  priceCash: 0,
  sizes: [],
  image: "",
  gallery: [],
  description: "",
  category: "",
}
  
   ]

export const navLinks = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Tienda', href: '/#tienda' },
  { label: 'Categorías', href: '/#categorias' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Contacto', href: '/#contacto' },
]

export function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

export function getProductBySlug(slug: string) {
  return featuredProducts.find((p) => p.slug === slug)
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories()
  return categories.find((category) => category.slug === slug)
}

export async function getCollections() {
  const products = await getProducts()

  const uniqueCollections = Array.from(
    new Set(
      (products as Array<{ coleccion?: string | null }> || [])
        .map((product) => String(product.coleccion ?? '').trim())
        .filter(Boolean),
    ),
  )

  return uniqueCollections.map((name) => ({
    name,
    slug: slugifyCategory(name),
  }))
}

export async function getCollectionBySlug(slug: string) {
  const collections = await getCollections()
  return collections.find((collection) => collection.slug === slug)
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const category = await getCategoryBySlug(slug)
  if (!category) return []

  const products = await getProducts()

  return products
    .filter((product: any) => getMainCategoryFromProduct(product) === category.name)
    .map((product: any) => {
      const imagenes = Array.isArray(product.imagenes)
        ? product.imagenes
        : typeof product.imagenes === 'string'
          ? (() => {
              try {
                return JSON.parse(product.imagenes)
              } catch {
                return []
              }
            })()
          : []

      return {
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
        subcategoria: product.subcategoria ?? '',
      }
    })
}
export async function getProductsByCollection(slug: string): Promise<Product[]> {
  const collection = await getCollectionBySlug(slug)
  if (!collection) return []

  const products = await getProducts()

  return products
    .filter((product: any) => normalizeText(product.coleccion) === normalizeText(collection.name))
    .map((product: any) => {
      const imagenes = Array.isArray(product.imagenes)
        ? product.imagenes
        : typeof product.imagenes === 'string'
          ? (() => {
              try {
                return JSON.parse(product.imagenes)
              } catch {
                return []
              }
            })()
          : []

      return {
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
        subcategoria: product.subcategoria ?? '',
      }
    })
}