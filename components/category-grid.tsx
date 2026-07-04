import Link from 'next/link'
import { getCategories } from '@/lib/data'

const CATEGORY_IMAGE_OVERRIDES: Record<string, string> = {
  Sandalias: '/sandalias.png',
  Vestidos: '/vestido.png',
  Pantalones: '/pantalones.png',
  Abrigos: '/abrigos.png',
  'Sobres de Fiesta': '/sobredefiestas.png',
}

const CATEGORY_IMAGE_CLASSES: Record<string, string> = {
  Botas: 'object-cover object-center',
  Sandalias: 'object-contain object-center scale-[1.18] mix-blend-multiply',
  Vestidos: 'object-contain object-top',
  Pantalones: 'object-contain object-top mix-blend-multiply',
  Abrigos: 'object-contain object-top mix-blend-multiply',
  'Sobres de Fiesta': 'object-contain object-center mix-blend-multiply',
}

export async function CategoryGrid() {
  const categories = (await getCategories())
    .map((category) => ({
      ...category,
      image: CATEGORY_IMAGE_OVERRIDES[category.name] ?? category.image,
    }))

  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold uppercase tracking-wide text-foreground sm:text-xl">
          Comprá por categorías
        </h2>
        <Link
          href="#tienda"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
        >
          Ver todas
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="group flex flex-col overflow-hidden border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="isolate aspect-square overflow-hidden bg-secondary">
              <img
                src={category.image || '/placeholder.svg'}
                alt={`Calzado de la categoría ${category.name}`}
                className={`size-full transition-transform duration-500 group-hover:scale-105 ${CATEGORY_IMAGE_CLASSES[category.name] ?? 'object-cover object-center'}`}
              />
            </div>
            <span className="py-3 text-center text-xs font-semibold uppercase tracking-wide text-foreground">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
