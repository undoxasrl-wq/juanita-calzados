import { Button } from '@/components/ui/button'

export function PromoBanners() {
  return (
    <section
      id="nosotros"
      className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-3"
    >
      {/* Banner 1 - text + product */}
      <div className="relative flex flex-col justify-center overflow-hidden bg-accent p-8">
        <h3 className="font-serif text-2xl font-medium leading-tight text-primary">
          ESTILO QUE
          <br />
          TE REPRESENTA
        </h3>
        <p className="mt-3 text-sm text-foreground/80">
          Elegí lo que va con vos.
          <br />
          Siempre.
        </p>
        <div className="mt-5">
          <Button
            size="sm"
            render={<a href="#tienda" />}
            className="rounded-none text-xs font-semibold uppercase tracking-widest"
          >
            Conocé más
          </Button>
        </div>
        <img
          src="/juanita-exterior.jpg"
          alt="Fachada del local de Juanita Calzados"
          className="pointer-events-none absolute bottom-0 right-0 h-40 w-1/2 object-contain"
        />
      </div>

      {/* Banner 2 - image */}
      <div className="relative min-h-[220px] overflow-hidden bg-secondary">
        <img
          src="/juanita-experiencia.jpg"
          alt="Sector de atención y recepción rosa de Juanita Calzados"
          className="size-full object-cover"
        />
      </div>

      {/* Banner 3 - image + text */}
      <div className="relative min-h-[220px] overflow-hidden bg-secondary">
        <img
          src="/juanita-calzado.jpg"
          alt="Estantes con la colección de calzado de Juanita"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-end justify-center p-8 text-right">
          <h3 className="font-serif text-2xl font-medium leading-tight text-primary">
            NUEVA
            <br />
            TEMPORADA
          </h3>
          <p className="mt-3 text-sm text-foreground/80">
            Nuevos looks,
            <br />
            nuevas historias.
          </p>
            <div className="mt-5">
              <Button
                size="sm"
                render={<a href="#tienda" />}
                className="rounded-none text-xs font-semibold uppercase tracking-widest"
              >
                Ver Colección
              </Button>
            </div>
        </div>
      </div>
    </section>
  )
}
