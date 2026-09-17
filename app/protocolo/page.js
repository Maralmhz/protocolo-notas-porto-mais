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
      setNotas(data);
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
      const url = nota.id ? `/api/notas?id=${nota.id}` : "/api/notas";
      const method = nota.id ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nota),
      });
      
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
      await fetch(`/api/notas?id=${id}`, { method: "DELETE" });
      await carregarNotas();
    } catch (err) {
      console.error("Erro ao excluir nota:", err);
      alert("Erro ao excluir nota.");
    }
  }

  async function assinarNota(id, pin) {
    try {
      await fetch("/api/notas/assinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pin }),
      });
      await carregarNotas();
      setPinParaAssinatura(null);
    } catch (err) {
      console.error("Erro ao assinar nota:", err);
      alert("PIN inv�lido ou erro ao assinar.");
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
      nota.nf?.toLowerCase().includes(termo) ||
      nota.observacao?.toLowerCase().includes(termo)
    );
  });

  return (
    <AuthGate>
      <div style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}>
        <MenuPrincipal />
        
        <main style={{
          flex: 1,
          width: "100%",
          boxSizing: "border-box",
          padding: "20px 16px 32px",
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
              placeholder="Buscar por fornecedor, NF ou observa��o..."
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
            onAssinar={(id) => setPinParaAssinatura(id)}
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

          {pinParaAssinatura !== null && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "8px",
                minWidth: "300px",
              }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
                  Digite o PIN para assinar
                </h3>
                <input
                  type="password"
                  placeholder="PIN"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      assinarNota(pinParaAssinatura, e.target.value);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                  autoFocus
                />
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setPinParaAssinatura(null)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.previousElementSibling.querySelector("input");
                      assinarNota(pinParaAssinatura, input.value);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#0B3D91",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Assinar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}
