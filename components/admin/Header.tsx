type Props = {
  onSignOut?: () => void
}

export default function Header({ onSignOut }: Props) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
        background: "#ffffff",
        borderBottom: "1px solid #eee",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>Panel de Administración</h2>
        <p style={{ margin: 0, color: "#666" }}>
          Juanita Calzados
        </p>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        style={{
          background: "#d66b86",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </header>
  )
}