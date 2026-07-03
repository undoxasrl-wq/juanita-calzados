export default function Sidebar() {
  return (
    <aside
      style={{
        width: "250px",
        background: "#2d2d2d",
        color: "white",
        minHeight: "100vh",
        padding: "30px 20px",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>
        Juanita Admin
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <button style={boton}>🏠 Dashboard</button>
        <button style={boton}>📦 Productos</button>
        <button style={boton}>📂 Categorías</button>
        <button style={boton}>🛒 Pedidos</button>
        <button style={boton}>⚙ Configuración</button>
      </nav>
    </aside>
  );
}

const boton = {
  background: "transparent",
  color: "white",
  border: "none",
  textAlign: "left" as const,
  fontSize: "16px",
  cursor: "pointer",
  padding: "10px",
  borderRadius: "8px",
};