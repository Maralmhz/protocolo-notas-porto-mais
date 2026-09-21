"use client";

import { useState } from "react";

function formatarDataBR(data) {
  if (!data) return "-";
  const texto = String(data).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) return texto;
  const matchIso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (matchIso) {
    const [, ano, mes, dia] = matchIso;
    return `${dia}/${mes}/${ano}`;
  }
  const d = new Date(texto);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

function formatarMoeda(valor) {
  if (!valor && valor !== 0) return "-";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function extrairEntrega(nota) {
  return nota.data_entrega ?? nota.dataEntrega ?? nota.delivery_date ?? nota.entrega ?? null;
}

function extrairVencimento(nota) {
  return nota.data_vencimento ?? nota.dataVencimento ?? nota.due_date ?? nota.vencimento ?? null;
}

export default function TabelaNotas({ notas = [], loading, onEditar, onAssinar, onExcluir }) {
  const [ordenacao, setOrdenacao] = useState({ campo: "data_entrega", direcao: "desc" });

  if (loading) return <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Carregando notas...</div>;
  if (notas.length === 0) return <div style={{ textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "8px", color: "#666" }}>Nenhuma nota encontrada.</div>;

  function ordenar(campo) {
    setOrdenacao((prev) => ({ campo, direcao: prev.campo === campo && prev.direcao === "asc" ? "desc" : "asc" }));
  }

  const notasOrdenadas = [...notas].sort((a, b) => {
    let valA = a[ordenacao.campo];
    let valB = b[ordenacao.campo];
    if (ordenacao.campo === "data_entrega") { valA = extrairEntrega(a); valB = extrairEntrega(b); }
    if (ordenacao.campo === "data_vencimento") { valA = extrairVencimento(a); valB = extrairVencimento(b); }
    if (!valA) return 1;
    if (!valB) return -1;
    if (valA < valB) return ordenacao.direcao === "asc" ? -1 : 1;
    if (valA > valB) return ordenacao.direcao === "asc" ? 1 : -1;
    return 0;
  });

  const actionsHeaderStyle = { position: "sticky", right: 0, zIndex: 2, minWidth: "150px", backgroundColor: "#f8f9fa", boxShadow: "-3px 0 6px rgba(0,0,0,0.06)", textAlign: "center" };
  const actionsCellStyle = { position: "sticky", right: 0, zIndex: 1, minWidth: "150px", backgroundColor: "#fff", boxShadow: "-3px 0 6px rgba(0,0,0,0.06)", textAlign: "center" };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table style={{ width: "100%", minWidth: "1150px", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead><tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
            <th onClick={() => ordenar("data_entrega")} style={thStyle}>Entrega</th><th onClick={() => ordenar("data_vencimento")} style={thStyle}>Vencimento</th><th onClick={() => ordenar("numero_nf")} style={thStyle}>NF</th><th onClick={() => ordenar("fornecedor")} style={thStyle}>Fornecedor</th><th style={{ ...thStyle, maxWidth: "200px" }}>Observação</th><th onClick={() => ordenar("valor")} style={{ ...thStyle, textAlign: "right" }}>Valor</th><th style={{ ...thStyle, textAlign: "center" }}>Parcelas</th><th style={{ ...thStyle, textAlign: "center" }}>Status</th><th style={actionsHeaderStyle}>Ações</th>
          </tr></thead>
          <tbody>{notasOrdenadas.map((nota, index) => { const assinado = nota.assinado === true || nota.assinado === "true" || nota.data_assinatura || nota.dataAssinatura; const rowBackground = assinado ? "#d4edda" : index % 2 === 0 ? "#fff" : "#fafafa"; return <tr key={nota.id || index} style={{ borderBottom: "1px solid #eee", backgroundColor: rowBackground }}>
            <td style={tdStyle}>{formatarDataBR(extrairEntrega(nota))}</td><td style={tdStyle}>{formatarDataBR(extrairVencimento(nota))}</td><td style={{ ...tdStyle, fontWeight: "500" }}>{nota.numero_nf || nota.nf || "-"}</td><td style={tdStyle}>{nota.fornecedor || "-"}</td><td style={{ ...tdStyle, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={nota.observacao || ""}>{nota.observacao || "-"}</td><td style={{ ...tdStyle, textAlign: "right", fontWeight: "500" }}>{formatarMoeda(nota.valor)}</td><td style={{ ...tdStyle, textAlign: "center" }}>{nota.parcelas || "-"}</td><td style={{ ...tdStyle, textAlign: "center" }}><span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", backgroundColor: assinado ? "#28a745" : "#fd7e14", color: "white", display: "inline-block" }}>{assinado ? "Assinado" : "Pendente"}</span></td><td style={{ ...actionsCellStyle, backgroundColor: rowBackground }}><div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", flexWrap: "nowrap" }}>{!assinado && <button onClick={() => onAssinar?.(nota)} style={actionButtonStyle("#0B3D91")}>Assinar</button>}<button onClick={() => onEditar?.(nota)} style={actionButtonStyle("#6c757d")}>Editar</button><button onClick={() => onExcluir?.(nota.id)} style={actionButtonStyle("#C8102E")}>Excluir</button></div></td>
          </tr>; })}</tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { padding: "8px 10px", textAlign: "left", fontWeight: "600", color: "#495057", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
const tdStyle = { padding: "8px 10px", color: "#333", whiteSpace: "nowrap", verticalAlign: "middle" };
function actionButtonStyle(color) { return { padding: "6px 9px", backgroundColor: color, color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "500", whiteSpace: "nowrap" }; }
