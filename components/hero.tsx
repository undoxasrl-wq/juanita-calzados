import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-secondary"
    >
      <div className="grid items-stretch lg:grid-cols-2">
        {/* Text panel */}
        <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:order-1 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Juanita · Temporada
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.05] text-primary sm:text-6xl lg:text-7xl">
            NUEVA
            <br />
            COLECCIÓN
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-foreground/80 sm:text-lg">
            Botas, texanas y botinetas hechas a mano. Lo último en moda para
            esta temporada, con la calidad y comodidad que te merecés.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              render={<a href="#tienda" />}
              className="rounded-none px-8 text-xs font-semibold uppercase tracking-widest"
            >
              Ver Colección
            </Button>
          </div>
        </div>

        {/* Image panel */}
        <div className="relative order-1 min-h-[60vw] sm:min-h-[420px] lg:order-2 lg:min-h-[600px]">
          <img
            src="/juanita-interior.jpg"
            alt="Interior del local de Juanita Calzados con pared rosa, percheros y estantes de calzado"
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent lg:bg-gradient-to-r" />
        </div>
      </div>
    </section>
  )
}
