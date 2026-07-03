import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { BenefitsBar } from '@/components/benefits-bar'
import { CategoryGrid } from '@/components/category-grid'
import { FeaturedProducts } from '@/components/featured-products'
import { PromoBanners } from '@/components/promo-banners'
import { InstagramFeed } from '@/components/instagram-feed'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <BenefitsBar />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanners />
        <InstagramFeed />
      </main>
      <SiteFooter />
    </div>
  )
}
