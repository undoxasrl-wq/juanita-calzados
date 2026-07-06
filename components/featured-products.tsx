import { ProductCard } from "@/components/product-card";
import { supabase } from "@/lib/supabase";
import { connection } from "next/server";

function mapTallesToSizes(talles: unknown): string[] {
  if (!Array.isArray(talles)) return [];

  const tallesCalzado = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"] as const;
  const tallesRopa = ["XS", "S", "M", "L", "XL", "XXL"] as const;
  const allowedTalles = [...tallesCalzado, ...tallesRopa] as const;

  const uniqueTalles = Array.from(
    new Set(
      talles
        .map((talle) => String(talle).trim().toUpperCase())
        .filter((talle) => allowedTalles.includes(talle as (typeof allowedTalles)[number])),
    ),
  );

  return uniqueTalles.sort(
    (a, b) => allowedTalles.indexOf(a as (typeof allowedTalles)[number]) - allowedTalles.indexOf(b as (typeof allowedTalles)[number]),
  );
}

export async function FeaturedProducts() {
  await connection();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando productos destacados:", error);
  }

  return (
    <section id="tienda" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold uppercase tracking-wide text-foreground sm:text-xl">
          Destacados
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {(products ?? []).map((product: any) => (
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
              sizes: mapTallesToSizes(product.talles),
              category: product.categoria,
            }}
          />
        ))}
      </div>
    </section>
  );
}