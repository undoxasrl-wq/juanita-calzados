"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  newOrdersCount?: number
}

type NavItem = {
  label: string
  href?: string
  disabled?: boolean
  isActive?: (pathname: string) => boolean
  showBadge?: boolean
}

const navItems = [
  { label: '🏠 Dashboard', href: '/admin', isActive: (pathname: string) => pathname === '/admin' },
  { label: '📦 Productos', href: '/admin#productos', isActive: () => false },
  { label: '📂 Categorías', disabled: true },
  { label: '🛒 Pedidos', href: '/admin/pedidos', isActive: (pathname: string) => pathname === '/admin/pedidos', showBadge: true },
  { label: '⚙ Configuración', disabled: true },
] satisfies NavItem[]

export default function Sidebar({ newOrdersCount = 0 }: Props) {
  const pathname = usePathname()

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
        {navItems.map((item) => {
          const isActive = item.isActive?.(pathname) ?? false

          if (item.disabled) {
            return (
              <button key={item.label} style={{ ...boton, opacity: 0.55, cursor: 'not-allowed' }} disabled>
                {item.label}
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                ...boton,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none',
                background: isActive ? 'rgba(214, 107, 134, 0.18)' : 'transparent',
                color: 'white',
                border: isActive ? '1px solid rgba(214, 107, 134, 0.4)' : '1px solid transparent',
              }}
            >
              <span>{item.label}</span>
              {item.showBadge && newOrdersCount > 0 ? <span style={badge}>{newOrdersCount}</span> : null}
            </Link>
          )
        })}
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

const badge = {
  minWidth: '24px',
  height: '24px',
  borderRadius: '999px',
  background: '#d66b86',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 8px',
}