import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Playfair_Display, Dancing_Script } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart-provider'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutPanel } from '@/components/checkout-panel'
import { WhatsappButton } from '@/components/whatsapp-button'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})
const dancingScript = Dancing_Script({
  variable: '--font-script',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Juanita Calzados | Calzado premium para mujer',
  description:
    'Moda, comodidad y tendencia en cada paso. Botas, texanas, botinetas, borcegos, zapatillas y sandalias para mujer.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${playfair.variable} ${dancingScript.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <WhatsappButton />
          <CartDrawer />
          <CheckoutPanel />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
