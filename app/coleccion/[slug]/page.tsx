import { notFound } from 'next/navigation'
import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { ProductCard } from '@/components/product-card'
import { SiteFooter } from '@/components/site-footer'
import { getCollectionBySlug, getProductsByCollection } from '@/lib/data'

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)

  if (!collection) {
    notFound()
  }

  const products = await getProductsByCollection(slug)

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Colección
              </p>
              <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
                {collection.name}
              </h1>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="mt-8 rounded border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No hay productos disponibles en esta colección por el momento.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
