'use client';
import { useState } from 'react';

function formatarData(data) {
  if (!data) return '-';
  const str = String(data).slice(0, 10);
  const [ano, mes, dia] = str.split('-');
  if (!ano || !mes || !dia) return '-';
  return `${dia}/${mes}/${ano}`;
}

const meses = [
  { valor: '01', nome: 'Janeiro' },
  { valor: '02', nome: 'Fevereiro' },
  { valor: '03', nome: 'Marco' },
  { valor: '04', nome: 'Abril' },
  { valor: '05', nome: 'Maio' },
  { valor: '06', nome: 'Junho' },
  { valor: '07', nome: 'Julho' },
  { valor: '08', nome: 'Agosto' },
  { valor: '09', nome: 'Setembro' },
  { valor: '10', nome: 'Outubro' },
  { valor: '11', nome: 'Novembro' },
  { valor: '12', nome: 'Dezembro' },
];

export default function TabelaNotas({ notas, setor, onAssinar, onEditar, onExcluir }) {
  const [mesFiltro, setMesFiltro] = useState('todos');
  const [excluindoId, setExcluindoId] = useState(null);
  const [pinExclusao, setPinExclusao] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');

  const notasOrdenadas = [...notas].sort((a, b) => {
    const dataA = new Date(a.data_entrega || 0);
    const dataB = new Date(b.data_entrega || 0);
    return dataB - dataA;
  });

  const notasFiltradas = notasOrdenadas.filter((n) => {
    if (mesFiltro === 'todos') return true;
    if (!n.data_vencimento) return false;
    const mesVencimento = String(n.data_vencimento).slice(0, 10).split('-')[1];
    return mesVencimento === mesFiltro;
  });

  async function confirmarExclusao() {
    if (pinExclusao !== '1010') {
      setErroExclusao('PIN incorreto!');
      return;
    }
    try {
      const res = await fetch(`/api/notas/${excluindoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinExclusao }),
      });
      if (res.ok) {
        setExcluindoId(null);
        setPinExclusao('');
        setErroExclusao('');
        onExcluir && onExcluir();
      } else {
        const data = await res.json();
        setErroExclusao(data.error || 'Erro ao excluir');
      }
    } catch (e) {
      setErroExclusao('Erro ao excluir nota');
    }
  }

  function cancelarExclusao() {
    setExcluindoId(null);
    setPinExclusao('');
    setErroExclusao('');
  }

  const thStyle = { padding: '10px 8px', textAlign: 'left', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '8px', verticalAlign: 'middle', whiteSpace: 'nowrap' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <label style={{ fontSize: 14, color: '#333' }}>Filtrar por mes de vencimento:</label>
        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        >
          <option value="todos">Todos os meses</option>
          {meses.map((m) => (
            <option key={m.valor} value={m.valor}>{m.nome}</option>
          ))}
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: 13 }}>
          <thead style={{ background: '#0B3D91', color: '#fff' }}>
            <tr>
              <th style={{ ...thStyle, position: 'sticky', left: 0, background: '#0B3D91', zIndex: 2, minWidth: 160 }}>Acoes</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Entrega</th>
              <th style={thStyle}>Vencimento</th>
              <th style={thStyle}>NF</th>
              <th style={thStyle}>Fornecedor</th>
              <th style={thStyle}>Observacao</th>
              <th style={thStyle}>Valor</th>
              <th style={thStyle}>Parcelas</th>
              <th style={thStyle}>Lancado por</th>
              <th style={thStyle}>Assinado por</th>
            </tr>
          </thead>
          <tbody>
            {notasFiltradas.map((n) => (
              <tr
                key={n.id}
                style={{
                  borderBottom: '1px solid #eee',
                  background: n.status === 'Assinado' ? '#eafbe7' : '#fff',
                }}
              >
                <td style={{ ...tdStyle, position: 'sticky', left: 0, background: n.status === 'Assinado' ? '#eafbe7' : '#fff', zIndex: 1 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {n.status !== 'Assinado' && (
                      <button
                        onClick={() => onAssinar(n.id)}
                        style={{ background: '#C8102E', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}
                      >
                        Assinar
                      </button>
                    )}
                    <button
                      onClick={() => onEditar(n)}
                      style={{ background: '#0B3D91', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setExcluindoId(n.id)}
                      style={{ background: '#555', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    background: n.status === 'Assinado' ? '#28a745' : '#6c757d',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '2px 10px',
                    fontSize: 12,
                    whiteSpace: 'nowrap'
                  }}>
                    {n.status}
                  </span>
                </td>
                <td style={tdStyle}>{formatarData(n.data_entrega)}</td>
                <td style={tdStyle}>{formatarData(n.data_vencimento)}</td>
                <td style={tdStyle}>{n.numero_nf}</td>
                <td style={tdStyle}>{n.fornecedor}</td>
                <td style={tdStyle}>{n.observacao}</td>
                <td style={tdStyle}>R$ {n.valor}</td>
                <td style={tdStyle}>{n.parcelas}</td>
                <td style={tdStyle}>{n.criado_por}</td>
                <td style={tdStyle}>{n.assinado_por || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {excluindoId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: 380 }}>
            <h3 style={{ color: '#0B3D91' }}>Confirmar exclusao</h3>
            <p style={{ color: '#333' }}>Tem certeza que deseja excluir esta nota fiscal? Esta acao e definitiva.</p>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Digite o PIN para confirmar:</label>
            <input
              type="password"
              value={pinExclusao}
              onChange={(e) => setPinExclusao(e.target.value)}
              maxLength={4}
              style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc' }}
            />
            {erroExclusao && <p style={{ color: '#C8102E', fontSize: 14 }}>{erroExclusao}</p>}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={confirmarExclusao}
                style={{ background: '#C8102E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', flex: 1 }}
              >
                Excluir definitivamente
              </button>
              <button
                onClick={cancelarExclusao}
                style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', flex: 1 }}
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
