import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export async function FeaturedProducts() {
  const products = await getProducts();

  return (
    <section id="tienda" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold uppercase tracking-wide text-foreground sm:text-xl">
          Destacados
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              slug: product.id.toString(),
              name: product.nombre,
              image: product.imagenes?.[0] || "/placeholder.svg",
              gallery: product.imagenes || [],
              priceCard: product.precio_tarjeta,
              priceCash: product.precio_efectivo,
              description: product.descripcion,
              sizes: product.talles || [],
              category: product.categoria,
            }}
          />
        ))}
      </div>
    </section>
  );
}