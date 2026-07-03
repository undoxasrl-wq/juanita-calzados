"use client";

import { useState, useEffect } from "react";

type FormData = {
  nombre: string;
  categoria: string;
  subcategoria: string;
  precioEfectivo: string;
  precioTarjeta: string;
  talles: string[];
  descripcion: string;
  imagenes: File[];
};

type Props = {
  onSave?: (formData: FormData) => void;
  onCancel?: () => void;
  initialData?: any;
};

export default function ProductForm({ onSave, onCancel, initialData }: Props) {
  // Pre-cargar datos si es edición
  const initializeFormData = () => {
    if (initialData) {
      const precio = initialData.precio.replace("$", "").replace(/,/g, "");
      return {
        nombre: initialData.nombre,
        categoria: initialData.categoria,
        subcategoria: initialData.subcategoria ?? "",
        precioEfectivo: precio,
        precioTarjeta: precio,
        talles: initialData.talles ?? [],
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
  
  const tallesDisponibles = ["XS", "S", "M", "L", "XL", "XXL"];
  const categorias = ["Zapatos", "Botas", "Sandalias", "Zapatillas", "Accesorios", "Pantalones", "Vestidos", "Abrigos"];
  const subcategoriesByCategory: Record<string, string[]> = {
    Botas: ["Texanas", "Bucaneras", "Borcegos", "Western", "Flecos"],
    Sandalias: ["Plataforma", "Chatitas", "Taco alto", "Taco bajo"],
    Zapatillas: ["Urbanas", "Deportivas", "Casual"],
    Vestidos: ["Cortos", "Largos", "Fiesta", "Casual"],
    Pantalones: ["Jean", "Vestir", "Cargo", "Palazzo"],
    Accesorios: ["Carteras", "Cintos", "Billeteras"],
  };

  const availableSubcategorias = subcategoriesByCategory[formData.categoria] ?? [];

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

  const handleTalleChange = (talle: string) => {
    setFormData((prev) => ({
      ...prev,
      talles: prev.talles.includes(talle)
        ? prev.talles.filter((t) => t !== talle)
        : [...prev.talles, talle],
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
            {categorias.map((cat) => (
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
              marginBottom: "12px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Talles Disponibles
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
