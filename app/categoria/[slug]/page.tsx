import { notFound } from 'next/navigation'
import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/data'
import { CategoryProducts } from '@/components/category-products'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(slug)

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Categoría
              </p>
              <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
                {category.name}
              </h1>
            </div>
          </div>

          <CategoryProducts categoryName={category.name} products={products} />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
