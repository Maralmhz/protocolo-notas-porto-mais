"use client";

import { useState } from "react";

export default function TabelaNotas({ notas, loading, onEditar, onAssinar, onExcluir }) {
  const [modalExclusao, setModalExclusao] = useState(null);

  function formatarData(dataIso) {
    if (!dataIso) return "";
    try {
      const data = new Date(dataIso);
      return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } catch {
      return dataIso;
    }
  }

  function formatarMoeda(valor) {
    if (valor === null || valor === undefined || valor === "") return "R$ 0,00";
    const num = typeof valor === "string" ? parseFloat(valor.replace(/[^0-9.]/g, "")) : valor;
    if (isNaN(num)) return "R$ 0,00";
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        color: "#666",
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <div style={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "white",
      }}>
        <table style={{
          width: "100%",
          minWidth: "1260px",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}>
          <thead>
            <tr style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #dee2e6",
            }}>
              <th style={headerStyle}>Entrega</th>
              <th style={headerStyle}>Vencimento</th>
              <th style={headerStyle}>NF</th>
              <th style={headerStyle}>Fornecedor</th>
              <th style={{ ...headerStyle, maxWidth: "200px" }}>Observa��o</th>
              <th style={headerStyle}>Valor</th>
              <th style={headerStyle}>Parcelas</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>A��es</th>
            </tr>
          </thead>
          <tbody>
            {notas.length === 0 ? (
              <tr>
                <td colSpan={9} style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#666",
                  backgroundColor: "#fafafa",
                }}>
                  Nenhuma nota encontrada
                </td>
              </tr>
            ) : (
              notas.map((nota, index) => {
                const assinado = nota.assinado === true || nota.assinado === "true" || nota.dataAssinatura;
                const backgroundColor = assinado ? "#d4edda" : (index % 2 === 0 ? "#ffffff" : "#f8f9fa");
                
                return (
                  <tr
                    key={nota.id || index}
                    style={{
                      backgroundColor,
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <td style={cellStyle}>{formatarData(nota.dataEntrega)}</td>
                    <td style={cellStyle}>{formatarData(nota.dataVencimento)}</td>
                    <td style={cellStyle}>{nota.nf || "-"}</td>
                    <td style={cellStyle}>{nota.fornecedor || "-"}</td>
                    <td style={{
                      ...cellStyle,
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {nota.observacao || "-"}
                    </td>
                    <td style={cellStyle}>{formatarMoeda(nota.valor)}</td>
                    <td style={cellStyle}>{nota.parcelas || "-"}</td>
                    <td style={cellStyle}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                        backgroundColor: assinado ? "#28a745" : "#fd7e14",
                        color: "white",
                        display: "inline-block",
                      }}>
                        {assinado ? "Assinado" : "Pendente"}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "nowrap",
                      }}>
                        <button
                          onClick={() => onEditar(nota)}
                          style={actionButtonStyle("gray")}
                          title="Editar"
                        >
                          Editar
                        </button>
                        {!assinado && (
                          <button
                            onClick={() => onAssinar(nota.id)}
                            style={actionButtonStyle("#0B3D91")}
                            title="Assinar"
                          >
                            Assinar
                        </button>
                        )}
                        <button
                          onClick={() => setModalExclusao(nota)}
                          style={actionButtonStyle("#C8102E")}
                          title="Excluir"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalExclusao && (
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
            minWidth: "320px",
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
              Confirmar exclus�o
            </h3>
            <p style={{
              color: "#666",
              marginBottom: "20px",
              fontSize: "14px",
            }}>
              Tem certeza que deseja excluir a nota NF{" "}
              <strong>{modalExclusao.nf || "N�o informada"}</strong> do fornecedor{" "}
              <strong>{modalExclusao.fornecedor || "N�o informado"}</strong>?
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setModalExclusao(null)}
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
                onClick={() => {
                  onExcluir(modalExclusao.id);
                  setModalExclusao(null);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#C8102E",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const headerStyle = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: "600",
  color: "#495057",
  borderBottom: "2px solid #dee2e6",
  whiteSpace: "nowrap",
  fontSize: "13px",
};

const cellStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #e0e0e0",
  verticalAlign: "middle",
  fontSize: "13px",
  color: "#333",
};

function actionButtonStyle(color) {
  return {
    padding: "6px 9px",
    backgroundColor: color,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  };
}
