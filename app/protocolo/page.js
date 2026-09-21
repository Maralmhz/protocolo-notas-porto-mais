"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGate from "../components/AuthGate";
import MenuPrincipal from "../components/MenuPrincipal";
import ModalNota from "../components/ModalNota";
import TabelaNotas from "../components/TabelaNotas";

export default function ProtocoloPage() {
  const router = useRouter();
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [pinParaAssinatura, setPinParaAssinatura] = useState(null);

  useEffect(() => {
    carregarNotas();
  }, []);

  async function carregarNotas() {
    try {
      const res = await fetch("/api/notas");
      const data = await res.json();
      setNotas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar notas:", err);
    } finally {
      setLoading(false);
    }
  }

  function abrirNovaNota() {
    setNotaEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(nota) {
    setNotaEditando(nota);
    setModalAberto(true);
  }

  async function salvarNota(nota) {
    try {
      const url = nota.id ? `/api/notas/${nota.id}` : "/api/notas";
      const method = nota.id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nota),
      });

      if (!res.ok) {
        throw new Error("Falha ao salvar nota");
      }
      
      await carregarNotas();
      setModalAberto(false);
      setNotaEditando(null);
    } catch (err) {
      console.error("Erro ao salvar nota:", err);
      alert("Erro ao salvar nota. Tente novamente.");
    }
  }

  async function excluirNota(id) {
    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
    
    try {
      await fetch(`/api/notas/${id}`, { method: "DELETE" });
      await carregarNotas();
    } catch (err) {
      console.error("Erro ao excluir nota:", err);
      alert("Erro ao excluir nota.");
    }
  }

  async function exportarCSV() {
    try {
      const res = await fetch("/api/notas/csv");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `notas-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar CSV:", err);
    }
  }

  const notasFiltradas = notas.filter((nota) => {
    const termo = busca.toLowerCase();
    return (
      nota.fornecedor?.toLowerCase().includes(termo) ||
      nota.numero_nf?.toLowerCase().includes(termo) ||
      nota.observacao?.toLowerCase().includes(termo)
    );
  });

  return (
    <AuthGate>
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}>
        <MenuPrincipal />
        
        <main style={{
          flex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          boxSizing: "border-box",
          padding: "24px 20px 40px",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <h1 style={{ 
              fontSize: "24px", 
              fontWeight: "600",
              color: "#333",
              margin: 0,
            }}>
              Protocolo de Notas
            </h1>
            
            <div style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}>
              <button
                onClick={abrirNovaNota}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#0B3D91",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                + Nova nota
              </button>
              
              <button
                onClick={exportarCSV}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Exportar CSV
              </button>
            </div>
          </div>

          <div style={{
            marginBottom: "20px",
          }}>
            <input
              type="text"
              placeholder="Buscar por fornecedor, NF ou observação..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <TabelaNotas
            notas={notasFiltradas}
            loading={loading}
            onEditar={abrirEdicao}
            onExcluir={excluirNota}
          />

          <ModalNota
            aberto={modalAberto}
            nota={notaEditando}
            onClose={() => {
              setModalAberto(false);
              setNotaEditando(null);
            }}
            onSave={salvarNota}
          />
        </main>
      </div>
    </AuthGate>
  );
}
