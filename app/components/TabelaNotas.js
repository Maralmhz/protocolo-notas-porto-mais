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
  { valor: '03', nome: 'Março' },
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

export default function TabelaNotas({ notas, setor, onAssinar, onEditar, onExcluir, mesSelecionado, onMesChange }) {
  const [pinModal, setPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinAcao, setPinAcao] = useState(null);
  const [pinNota, setPinNota] = useState(null);
  const [pinErro, setPinErro] = useState(false);

  const notasFiltradas = mesSelecionado
    ? notas.filter(n => {
        const venc = String(n.data_vencimento || '').slice(5, 7);
        return venc === mesSelecionado;
      })
    : notas;

  function pedirPin(acao, nota) {
    setPinAcao(acao);
    setPinNota(nota);
    setPinInput('');
    setPinErro(false);
    setPinModal(true);
  }

  function confirmarPin() {
    if (pinInput === '1010') {
      setPinModal(false);
      if (pinAcao === 'editar') onEditar(pinNota);
      if (pinAcao === 'excluir') onExcluir(pinNota);
    } else {
      setPinErro(true);
    }
  }

  const thStyle = {
    padding: '10px 12px',
    textAlign: 'left',
    backgroundColor: '#1a3a6b',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  };

  const thStyleRight = {
    ...thStyle,
    position: 'sticky',
    right: 0,
    zIndex: 2,
    backgroundColor: '#1a3a6b',
  };

  const tdStyle = {
    padding: '8px 12px',
    fontSize: '13px',
    borderBottom: '1px solid #ddd',
    whiteSpace: 'nowrap',
  };

  const tdStyleRight = {
    ...tdStyle,
    position: 'sticky',
    right: 0,
    backgroundColor: '#f0f4f8',
    zIndex: 1,
  };

  function formatarValor(v) {
    if (!v && v !== 0) return '-';
    const num = parseFloat(v);
    if (isNaN(num)) return v;
    return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <div>
      {/* Filtro por mes */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Filtrar por mes de vencimento:</label>
        <select
          value={mesSelecionado || ''}
          onChange={e => onMesChange(e.target.value || null)}
          style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value=''>Todos os meses</option>
          {meses.map(m => (
            <option key={m.valor} value={m.valor}>{m.nome}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Entrega</th>
              <th style={thStyle}>Vencimento</th>
              <th style={thStyle}>NF</th>
              <th style={thStyle}>Fornecedor</th>
              <th style={thStyle}>Valor</th>
              <th style={thStyle}>Parcelas</th>
              <th style={thStyleRight}>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {notasFiltradas.map((n, i) => (
              <tr key={n.id || i} style={{ backgroundColor: i % 2 === 0 ? '#f9fbf9' : '#fff' }}>
                <td style={tdStyle}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: n.status === 'Assinado' ? '#28a745' : '#6c757d',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {n.status || 'Entregue'}
                  </span>
                </td>
                <td style={tdStyle}>{formatarData(n.data_entrega)}</td>
                <td style={tdStyle}>{formatarData(n.data_vencimento)}</td>
                <td style={tdStyle}>{n.numero_nf || '-'}</td>
                <td style={tdStyle}>{n.fornecedor || '-'}</td>
                <td style={tdStyle}>{formatarValor(n.valor)}</td>
                <td style={tdStyle}>{n.parcelas || '-'}</td>
                <td style={tdStyleRight}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {n.status !== 'Assinado' && (
                      <button
                        onClick={() => onAssinar(n)}
                        style={{ padding: '4px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Assinar
                      </button>
                    )}
                    <button
                      onClick={() => pedirPin('editar', n)}
                      style={{ padding: '4px 10px', backgroundColor: '#1a3a6b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => pedirPin('excluir', n)}
                      style={{ padding: '4px 10px', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal PIN */}
      {pinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', minWidth: '280px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '16px' }}>Digite o PIN</h3>
            <input
              type='password'
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmarPin()}
              placeholder='PIN'
              style={{ padding: '8px', fontSize: '16px', width: '100%', marginBottom: '12px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            {pinErro && <p style={{ color: 'red', marginBottom: '10px' }}>PIN incorreto</p>}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={confirmarPin} style={{ padding: '8px 20px', backgroundColor: '#1a3a6b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Confirmar</button>
              <button onClick={() => setPinModal(false)} style={{ padding: '8px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
