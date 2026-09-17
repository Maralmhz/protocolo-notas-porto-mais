'use client';

import React, { useState } from 'react';

export default function TabelaNotas({ notas, onAssinar, onEditar, onExcluir }) {
  const [excluindoId, setExcluindoId] = useState(null);
  const [pinExclusao, setPinExclusao] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');

  function confirmarExclusao() {
    if (pinExclusao !== '1010') {
      setErroExclusao('PIN incorreto!');
      return;
    }
    onExcluir(excluindoId);
    setExcluindoId(null);
    setPinExclusao('');
    setErroExclusao('');
  }

  function estaAssinada(n) {
    return n.status === 'Assinado' || n.assinado_por != null || n.data_assinatura != null;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', backgroundColor: '#fff', border: '1px solid #ddd', borderCollapse: 'collapse', minWidth: '1200px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Entrega</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Vencimento</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>NF</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Fornecedor</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Observacao</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Valor</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Parcelas</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Status</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #ddd', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#333' }}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {notas?.map((n, index) => {
            const assinada = estaAssinada(n);
            return (
              <tr key={n.id} style={{ backgroundColor: assinada ? '#e8f5e9' : (index % 2 === 0 ? '#fff' : '#fafafa') }}>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#333' }}>{formatDate(n.data_entrega)}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#333' }}>{formatDate(n.data_vencimento)}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#333' }}>{n.numero_nf}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#333' }}>{n.fornecedor}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#666', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.observacao || '-'}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#333', fontWeight: '500' }}>{n.valor != null && n.valor !== '' ? `R$ ${parseFloat(n.valor).toFixed(2)}` : 'R$ 0.00'}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#666' }}>{n.parcelas || '-'}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                  <span style={{ padding: '6px 14px', borderRadius: '14px', fontSize: '12px', fontWeight: '600', backgroundColor: assinada ? '#4caf50' : '#ff9800', color: '#fff' }}>
                    {assinada ? 'Assinado' : 'Pendente'}
                  </span>
                </td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                  <button
                    onClick={() => onEditar(n)}
                    style={{ backgroundColor: '#757575', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 14px', marginRight: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onAssinar(n.id)}
                    disabled={assinada}
                    style={{ backgroundColor: assinada ? '#ccc' : '#2196f3', color: assinada ? '#999' : '#fff', border: 'none', borderRadius: '4px', padding: '8px 14px', marginRight: '6px', cursor: assinada ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '500' }}
                  >
                    Assinar
                  </button>
                  <button
                    onClick={() => {
                      setExcluindoId(n.id);
                      setPinExclusao('');
                      setErroExclusao('');
                    }}
                    style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {excluindoId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', maxWidth: '400px', width: '100%', margin: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>Confirmar Exclusao</h3>
            <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Digite o PIN para excluir esta nota:</p>
            <input
              type="password"
              maxLength={4}
              value={pinExclusao}
              onChange={(e) => setPinExclusao(e.target.value)}
              style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '12px', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', marginBottom: '16px', boxSizing: 'border-box' }}
              placeholder="****"
              autoFocus
            />
            {erroExclusao && (
              <p style={{ color: '#f44336', marginBottom: '16px', fontSize: '14px' }}>{erroExclusao}</p>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={confirmarExclusao}
                style={{ flex: 1, backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px', cursor: 'pointer', fontWeight: '500' }}
              >
                Confirmar exclusao
              </button>
              <button
                onClick={() => {
                  setExcluindoId(null);
                  setPinExclusao('');
                  setErroExclusao('');
                }}
                style={{ flex: 1, backgroundColor: '#757575', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px', cursor: 'pointer', fontWeight: '500' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}