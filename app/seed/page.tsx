'use client'

import { seedProducts } from '@/lib/seed-products'

export default function SeedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={async () => {
          await seedProducts()
          alert('Productos cargados correctamente')
        }}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Cargar productos
      </button>
    </div>
  )
}