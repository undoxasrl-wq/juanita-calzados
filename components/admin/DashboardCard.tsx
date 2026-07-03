type Props = {
  titulo: string;
  valor: string | number;
};

export default function DashboardCard({ titulo, valor }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.08)",
        minWidth: "220px",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#777",
          fontSize: "14px",
        }}
      >
        {titulo}
      </p>

      <h2
        style={{
          marginTop: "12px",
          marginBottom: 0,
          fontSize: "32px",
        }}
      >
        {valor}
      </h2>
    </div>
  );
}