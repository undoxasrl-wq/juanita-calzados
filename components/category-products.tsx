"use client"

import { useEffect, useMemo, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Product, SUBCATEGORIES_BY_CATEGORY } from "@/lib/data"

function normalizeText(value: string) {
  return String(value ?? "").trim().toLowerCase()
}

export function CategoryProducts({ categoryName, products }: { categoryName: string; products: Product[] }) {
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("")
  const availableSubcategorias = useMemo(
    () => SUBCATEGORIES_BY_CATEGORY[categoryName] ?? [],
    [categoryName],
  )

  useEffect(() => {
    if (selectedSubcategoria && !availableSubcategorias.includes(selectedSubcategoria)) {
      setSelectedSubcategoria("")
    }
  }, [availableSubcategorias, selectedSubcategoria])

  const selectedSubcategoriaNormalized = normalizeText(selectedSubcategoria)

  const filteredProducts = useMemo(
    () =>
      selectedSubcategoria
        ? products.filter((product) => {
            const normalizedSubcategoria = normalizeText(product.subcategoria ?? "")
            if (normalizedSubcategoria === selectedSubcategoriaNormalized) {
              return true
            }

            // Compatibilidad con datos legacy: si una subcategoría quedó guardada en category.
            return normalizeText(product.category) === selectedSubcategoriaNormalized
          })
        : products,
    [products, selectedSubcategoria, selectedSubcategoriaNormalized],
  )

  return (
    <>
      {availableSubcategorias.length > 0 && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-700">Subcategorías</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubcategoria("")}
              className={`rounded border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                selectedSubcategoria === ""
                  ? "border-slate-700 bg-slate-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
              }`}
            >
              Todas
            </button>
            {availableSubcategorias.map((subcategoria) => (
              <button
                key={subcategoria}
                type="button"
                onClick={() => setSelectedSubcategoria(subcategoria)}
                className={`rounded border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  selectedSubcategoria === subcategoria
                    ? "border-slate-700 bg-slate-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                }`}
              >
                {subcategoria}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="mt-4 rounded border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No hay productos disponibles para esta subcategoría.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
