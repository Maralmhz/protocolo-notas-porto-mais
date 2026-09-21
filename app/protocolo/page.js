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
  const [notaParaAssinar, setNotaParaAssinar] = useState(null);
  const [pinAssinatura, setPinAssinatura] = useState("");
  const [erroPin, setErroPin] = useState("");

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

  function iniciarAssinatura(nota) {
    setNotaParaAssinar(nota);
    setPinAssinatura("");
    setErroPin("");
  }

  async function confirmarAssinatura() {
    if (pinAssinatura !== "1010") {
      setErroPin("PIN incorreto!");
      return;
    }

    try {
      const id = notaParaAssinar.id;
      const res = await fetch(`/api/notas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...notaParaAssinar,
          status: "Assinado",
          assinado: true,
          data_assinatura: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao assinar nota");
      }

      setNotaParaAssinar(null);
      setPinAssinatura("");
      setErroPin("");
      await carregarNotas();
    } catch (err) {
      console.error("Erro ao assinar nota:", err);
      setErroPin("Falha ao salvar assinatura. Tente novamente.");
    }
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
            onAssinar={iniciarAssinatura}
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

          {notaParaAssinar && (
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
                maxWidth: "380px",
                width: "90%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#0B3D91" }}>
                  Confirmar Assinatura
                </h3>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#555" }}>
                  Nota Fiscal: <strong>{notaParaAssinar.numero_nf || notaParaAssinar.nf || "-"}</strong><br/>
                  Fornecedor: <strong>{notaParaAssinar.fornecedor || "-"}</strong>
                </p>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "#333" }}>
                    Digite o PIN de autorização:
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={pinAssinatura}
                    onChange={(e) => setPinAssinatura(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirmarAssinatura()}
                    placeholder="PIN"
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "16px",
                      textAlign: "center",
                      border: erroPin ? "1px solid #e03131" : "1px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box",
                      letterSpacing: "4px",
                    }}
                  />
                  {erroPin && (
                    <span style={{ color: "#e03131", fontSize: "12px", marginTop: "4px", display: "block" }}>
                      {erroPin}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      setNotaParaAssinar(null);
                      setPinAssinatura("");
                      setErroPin("");
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarAssinatura}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#0B3D91",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Confirmar
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
