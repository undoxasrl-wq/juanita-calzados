import Link from 'next/link'
import { getCategories } from '@/lib/data'

export async function CategoryGrid() {
  const categories = await getCategories()

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
            <div className="aspect-square overflow-hidden bg-secondary">
              <img
                src={category.image || '/placeholder.svg'}
                alt={`Calzado de la categoría ${category.name}`}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
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
