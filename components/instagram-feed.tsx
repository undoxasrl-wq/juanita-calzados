'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const posts = [
  '/juanita-indumentaria.jpg',
  '/texana-cataleya.jpg',
  '/jalei-lifestyle.jpg',
  '/bota-tokio-lifestyle.jpg',
  '/kalei-dos-en-uno.jpg',
  '/bota-western-marron.jpg',
  '/jalei-chocolate.jpg',
]

export function InstagramFeed() {
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    if (!activeImage) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImage(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeImage])

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <h2 className="text-lg font-bold uppercase tracking-wide text-foreground sm:text-xl">
        Seguinos en Instagram{' '}
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          @JUANITACALZADOSOK
        </span>
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="flex flex-col items-center justify-center bg-accent p-4 text-center">
          <p className="font-serif text-xl font-medium leading-tight text-primary">
            cambios
          </p>
          <p className="mt-1 text-xs text-foreground/80">
            En Juanita estamos que lo rompemos
          </p>
        </div>
        {posts.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveImage(src)}
            aria-label={`Ampliar imagen ${i + 1}`}
            className="group relative aspect-square cursor-zoom-in overflow-hidden bg-secondary"
          >
            <img
              src={src || '/placeholder.svg'}
              alt={`Imagen de galería ${i + 1}`}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de imagen"
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
          >
            <X className="size-5" />
          </button>
          <img
            src={activeImage || '/placeholder.svg'}
            alt="Vista ampliada"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-md object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  )
}
