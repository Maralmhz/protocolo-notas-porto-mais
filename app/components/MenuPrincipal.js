"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuPrincipal() {
  const pathname = usePathname();

  const rotas = [
    { nome: "Protocolo", caminho: "/protocolo" },
    { nome: "Financeiro", caminho: "/financeiro" },
    { nome: "Eventos", caminho: "/eventos" },
    { nome: "Salvados", caminho: "/salvados" },
  ];

  return (
    <header style={{
      width: "100%",
      backgroundColor: "#0B3D91",
      color: "white",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        flexWrap: "wrap",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: "700",
          letterSpacing: "0.5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span>Porto Mais</span>
        </div>

        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflowX: "auto",
        }}>
          {rotas.map((rota) => {
            const ativo = pathname === rota.caminho;
            return (
              <Link
                key={rota.caminho}
                href={rota.caminho}
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  color: ativo ? "#0B3D91" : "white",
                  backgroundColor: ativo ? "white" : "transparent",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: ativo ? "600" : "500",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {rota.nome}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
