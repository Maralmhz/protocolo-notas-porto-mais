"use client";

import { useState, useEffect } from "react";
import AuthGate from "../components/AuthGate";
import MenuPrincipal from "../components/MenuPrincipal";
import ModalNota from "../components/ModalNota";
import TabelaNotas from "../components/TabelaNotas";

export default function ProtocoloPage() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operacaoEmAndamento, setOperacaoEmAndamento] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [notaParaAssinar, setNotaParaAssinar] = useState(null);
  const [pinAssinatura, setPinAssinatura] = useState("");
  const [erroPin, setErroPin] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => { carregarNotas(); }, []);

  async function carregarNotas() {
    setLoading(true);
    try {
      const res = await fetch("/api/notas", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao carregar notas");
      setNotas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar notas:", err);
      setMensagem(err.message || "Erro ao carregar notas.");
    } finally { setLoading(false); }
  }

  function abrirNovaNota() { setNotaEditando(null); setMensagem(""); setModalAberto(true); }
  function abrirEdicao(nota) { setNotaEditando(nota); setMensagem(""); setModalAberto(true); }
  function iniciarAssinatura(nota) { setNotaParaAssinar(nota); setPinAssinatura(""); setErroPin(""); }

  async function confirmarAssinatura() {
    if (operacaoEmAndamento) return;
    if (pinAssinatura !== "1010") { setErroPin("PIN incorreto!"); return; }
    setOperacaoEmAndamento(true);
    try {
      const id = notaParaAssinar.id;
      const res = await fetch(`/api/notas/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ acao: "assinar", setor: "Porto Mais" }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erro ao assinar nota");
      setNotaParaAssinar(null); setPinAssinatura(""); setErroPin(""); setMensagem("Nota assinada com sucesso."); await carregarNotas();
    } catch (err) { console.error(err); setErroPin(err.message || "Falha ao salvar assinatura."); }
    finally { setOperacaoEmAndamento(false); }
  }

  async function salvarNota(nota) {
    if (operacaoEmAndamento) return;
    setOperacaoEmAndamento(true);
    try {
      const url = nota.id ? `/api/notas/${nota.id}` : "/api/notas";
      const method = nota.id ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(nota) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Falha ao salvar nota");
      setMensagem(nota.id ? "Nota atualizada com sucesso." : "Nota criada com sucesso.");
      setModalAberto(false); setNotaEditando(null); await carregarNotas();
    } catch (err) { console.error(err); setMensagem(err.message || "Erro ao salvar nota. Tente novamente."); throw err; }
    finally { setOperacaoEmAndamento(false); }
  }

  async function excluirNota(id) {
    if (!id || operacaoEmAndamento) return;
    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
    setOperacaoEmAndamento(true);
    try {
      const res = await fetch(`/api/notas/${encodeURIComponent(id)}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin: "1010" }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erro ao excluir nota");
      setMensagem("Nota excluída com sucesso."); await carregarNotas();
    } catch (err) { console.error(err); setMensagem(err.message || "Erro ao excluir nota."); }
    finally { setOperacaoEmAndamento(false); }
  }

  const termo = busca.toLowerCase();
  const notasFiltradas = notas.filter((nota) => [nota.fornecedor, nota.numero_nf, nota.nf, nota.observacao].some((valor) => String(valor || "").toLowerCase().includes(termo)));

  return (
    <AuthGate>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <MenuPrincipal />
        <main style={{ flex: 1, width: "100%", maxWidth: "1400px", margin: "0 auto", boxSizing: "border-box", padding: "24px 20px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#333", margin: 0 }}>Protocolo de Notas</h1>
            <button onClick={abrirNovaNota} disabled={operacaoEmAndamento} style={{ padding: "10px 16px", backgroundColor: "#0B3D91", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>+ Nova nota</button>
          </div>
          {mensagem && <div style={{ marginBottom: 12, padding: 10, background: "#eef6ff", color: "#0B3D91", borderRadius: 6 }}>{mensagem}</div>}
          <div style={{ marginBottom: "20px" }}><input type="text" placeholder="Buscar por fornecedor, NF ou observação..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} /></div>
          <TabelaNotas notas={notasFiltradas} loading={loading} onEditar={abrirEdicao} onExcluir={excluirNota} onAssinar={iniciarAssinatura} />
          <ModalNota aberto={modalAberto} nota={notaEditando} onClose={() => { setModalAberto(false); setNotaEditando(null); }} onSave={salvarNota} />
          {notaParaAssinar && <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}><div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", maxWidth: "380px", width: "90%" }}><h3>Confirmar Assinatura</h3><p>Nota Fiscal: <strong>{notaParaAssinar.numero_nf || notaParaAssinar.nf || "-"}</strong><br />Fornecedor: <strong>{notaParaAssinar.fornecedor || "-"}</strong></p><input type="password" maxLength={6} value={pinAssinatura} onChange={(e) => setPinAssinatura(e.target.value)} onKeyDown={(e) => e.key === "Enter" && confirmarAssinatura()} placeholder="PIN" autoFocus style={{ width: "100%", padding: "10px", boxSizing: "border-box" }} />{erroPin && <span style={{ color: "#e03131", fontSize: "12px" }}>{erroPin}</span>}<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}><button onClick={() => setNotaParaAssinar(null)} disabled={operacaoEmAndamento}>Cancelar</button><button onClick={confirmarAssinatura} disabled={operacaoEmAndamento}>{operacaoEmAndamento ? "Salvando..." : "Confirmar"}</button></div></div></div>}
        </main>
      </div>
    </AuthGate>
  );
}
