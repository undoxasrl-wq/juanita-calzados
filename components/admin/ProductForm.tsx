"use client";

import { useState, useEffect } from "react";
import { MAIN_CATEGORIES, SUBCATEGORIES_BY_CATEGORY } from "@/lib/data";

type FormData = {
  nombre: string;
  categoria: string;
  subcategoria: string;
  precioEfectivo: string;
  precioTarjeta: string;
  tipoTalles: "calzado" | "ropa";
  talles: string[];
  descripcion: string;
  imagenes: File[];
};

type Props = {
  onSave?: (formData: FormData) => void;
  onCancel?: () => void;
  initialData?: any;
};

const TALLES_CALZADO = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"] as const;
const TALLES_ROPA = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const TALLES_VALIDOS = [...TALLES_CALZADO, ...TALLES_ROPA] as const;
const ORDEN_TALLES = [...TALLES_CALZADO, ...TALLES_ROPA] as const;

function detectTipoTalles(talles: string[]): "calzado" | "ropa" {
  const hasCalzado = talles.some((talle) => TALLES_CALZADO.includes(talle as (typeof TALLES_CALZADO)[number]));
  const hasRopa = talles.some((talle) => TALLES_ROPA.includes(talle as (typeof TALLES_ROPA)[number]));

  if (hasRopa && !hasCalzado) return "ropa";
  return "calzado";
}

function normalizeTalles(value: unknown, tipoTalles?: "calzado" | "ropa"): string[] {
  if (!Array.isArray(value)) return [];

  const allowedTalles: readonly string[] = tipoTalles === "ropa" ? TALLES_ROPA : tipoTalles === "calzado" ? TALLES_CALZADO : TALLES_VALIDOS;
  const allowedTallesSet = new Set(allowedTalles);

  const uniqueTalles = Array.from(
    new Set(
      value
        .map((talle) => String(talle).trim().toUpperCase())
        .filter((talle) => allowedTallesSet.has(talle)),
    ),
  );

  return uniqueTalles.sort(
    (a, b) => ORDEN_TALLES.indexOf(a as (typeof ORDEN_TALLES)[number]) - ORDEN_TALLES.indexOf(b as (typeof ORDEN_TALLES)[number]),
  );
}

export default function ProductForm({ onSave, onCancel, initialData }: Props) {
  // Pre-cargar datos si es edición
  const initializeFormData = (): FormData => {
    if (initialData) {
      const precio = initialData.precio.replace("$", "").replace(/,/g, "");
      const tallesNormalizados = normalizeTalles(initialData.talles);
      const tipoTalles = detectTipoTalles(tallesNormalizados);

      return {
        nombre: initialData.nombre,
        categoria: initialData.categoria,
        subcategoria: initialData.subcategoria ?? "",
        precioEfectivo: precio,
        precioTarjeta: precio,
        tipoTalles,
        talles: normalizeTalles(tallesNormalizados, tipoTalles),
        descripcion: initialData.descripcion ?? "",
        imagenes: [],
      };
    }
    return {
      nombre: "",
      categoria: "",
      subcategoria: "",
      precioEfectivo: "",
      precioTarjeta: "",
      tipoTalles: "calzado",
      talles: [],
      descripcion: "",
      imagenes: [],
    };
  };

  const [formData, setFormData] = useState<FormData>(initializeFormData());

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  useEffect(() => {
    if (initialData?.imagenes) {
      setPreviewUrls(initialData.imagenes);
    } else {
      setPreviewUrls([]);
    }
  }, [initialData]);

  const availableSubcategorias = SUBCATEGORIES_BY_CATEGORY[formData.categoria] ?? [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoria' ? { subcategoria: '' } : {}),
    }));
  };

  const handleTipoTallesChange = (tipoTalles: "calzado" | "ropa") => {
    setFormData((prev) => ({
      ...prev,
      tipoTalles,
      talles: normalizeTalles(prev.talles, tipoTalles),
    }));
  };

  const handleTalleChange = (talle: string) => {
    setFormData((prev) => ({
      ...prev,
      talles: prev.talles.includes(talle)
        ? prev.talles.filter((t) => t !== talle)
        : normalizeTalles([...prev.talles, talle], prev.tipoTalles),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...files],
    }));

    // Crear URLs de vista previa
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrls((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      console.log("Datos del formulario:", formData);
      alert("Producto guardado (ver consola para detalles)");
    }
  };

  const tallesDisponibles = formData.tipoTalles === "ropa" ? TALLES_ROPA : TALLES_CALZADO;

  return (
    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.08)",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ marginBottom: "30px", color: "#2d2d2d" }}>
        {initialData ? "Editar Producto" : "Agregar Nuevo Producto"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Nombre del producto */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Nombre del Producto
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
            placeholder="Ej: Zapato de Cuero Negro"
          />
        </div>

        {/* Categoría */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Categoría
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          >
            <option value="">Selecciona una categoría</option>
            {MAIN_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategoría */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Subcategoría
          </label>
          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleInputChange}
            required={availableSubcategorias.length > 0}
            disabled={availableSubcategorias.length === 0}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: availableSubcategorias.length === 0 ? '#f8f8f8' : 'white',
            }}
          >
            <option value="">
              {availableSubcategorias.length > 0 ? 'Selecciona una subcategoría' : 'Elige primero una categoría'}
            </option>
            {availableSubcategorias.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>

        {/* Precios en dos columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Precio en Efectivo */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Precio en Efectivo ($)
            </label>
            <input
              type="number"
              name="precioEfectivo"
              value={formData.precioEfectivo}
              onChange={handleInputChange}
              required
              step="0.01"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              placeholder="0.00"
            />
          </div>

          {/* Precio con Tarjeta */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Precio con Tarjeta ($)
            </label>
            <input
              type="number"
              name="precioTarjeta"
              value={formData.precioTarjeta}
              onChange={handleInputChange}
              required
              step="0.01"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Talles */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Tipo de talles
          </label>
          <select
            name="tipoTalles"
            value={formData.tipoTalles}
            onChange={(e) => handleTipoTallesChange(e.target.value as "calzado" | "ropa")}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
              marginBottom: "12px",
            }}
          >
            <option value="calzado">Calzado</option>
            <option value="ropa">Ropa</option>
          </select>

          <label
            style={{
              display: "block",
              marginBottom: "12px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Talles
          </label>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {tallesDisponibles.map((talle) => (
              <label
                key={talle}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.talles.includes(talle)}
                  onChange={() => handleTalleChange(talle)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span>{talle}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
              minHeight: "120px",
              fontFamily: "inherit",
            }}
            placeholder="Describe el producto, materiales, características, etc."
          />
        </div>

        {/* Subir Imágenes */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "12px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Imágenes del Producto
          </label>
          <div
            style={{
              border: "2px dashed #d66b86",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              background: "#fafafa",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{
                display: "none",
              }}
              id="imageInput"
            />
            <label htmlFor="imageInput" style={{ cursor: "pointer" }}>
              <p style={{ margin: 0, color: "#666", marginBottom: "10px" }}>
                📸 Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#999",
                }}
              >
                Formatos soportados: JPG, PNG, WebP
              </p>
            </label>
          </div>

          {/* Vista previa de imágenes */}
          {previewUrls.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "15px",
              }}
            >
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      cursor: "pointer",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "14px 24px",
              background: "#d66b86",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#c05575")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#d66b86")
            }
          >
            {initialData ? "✓ Actualizar Producto" : "✓ Guardar Producto"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(initializeFormData());
              setPreviewUrls([]);
              onCancel?.();
            }}
            style={{
              padding: "14px 24px",
              background: "#f0f0f0",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#e8e8e8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#f0f0f0")
            }
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
