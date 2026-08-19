'use client';
import { useState } from 'react';
const CORES_PRIORIDADE = { maxima: '#C8102E', alta: '#E08E00', normal: '#0B3D91' };
const LABEL_STATUS = {
  pendente: 'Pendente', autorizado: 'Autorizado', agendado: 'Agendado',
  pago: 'Pago', bloqueado: 'Bloqueado', cancelado: 'Cancelado',
};
function formatarDataBR(dataStr) {
  if (!dataStr) return '';
  const soData = String(dataStr).slice(0, 10);
  const [ano, mes, dia] = soData.split('-');
  if (!ano || !mes || !dia) return soData;
  return `${dia}/${mes}/${ano}`;
}

export default function TabelaFinanceiro({ itens, onEditar, onPagar, onAgendar }) {
  const [pagando, setPagando] = useState(null);
  const [agendando, setAgendando] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const hoje = new Date().toISOString().slice(0, 10);

  function copiarParaWhatsapp() {
    const pendentes = itens.filter((i) => i.status !== 'pago');
    if (pendentes.length === 0) {
      alert('Nao ha lancamentos em aberto para copiar.');
      return;
    }
    let texto = '*Cobranca Financeiro - Porto Mais*\n';
    texto += `_Atualizado em ${formatarDataBR(hoje)}_\n\n`;
    pendentes.forEach((item) => {
      const vencido = item.status !== 'pago' && item.data_vencimento < hoje;
      const valorFmt = Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const prioridadeTag = item.prioridade === 'maxima' ? ' [PRIORIDADE MAXIMA]' : item.prioridade === 'alta' ? ' [ALTA]' : '';
      texto += `- ${item.credor} (${item.tipo_credor}) - Parcela ${item.parcela_atual}/${item.total_parcelas} - ${valorFmt} - Venc: ${formatarDataBR(item.data_vencimento)}${vencido ? ' (VENCIDO)' : ''} - Status: ${LABEL_STATUS[item.status] || item.status}${prioridadeTag}\n`;
    });
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={copiarParaWhatsapp} style={{ ...btn('#25D366'), margin: 0, padding: '10px 16px', fontSize: 14 }}>
          {copiado ? 'Copiado!' : 'Copiar para WhatsApp'}
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f4f6f9', textAlign: 'left' }}>
              <th style={th}>Prioridade</th><th style={th}>Credor</th><th style={th}>Tipo</th>
              <th style={th}>Parcela</th><th style={th}>Valor</th><th style={th}>Vencimento</th>
              <th style={th}>Status</th><th style={th}>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => {
              const vencido = item.status !== 'pago' && item.data_vencimento < hoje;
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>
                    <span style={{ color: '#fff', background: CORES_PRIORIDADE[item.prioridade] || '#999', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>
                      {item.prioridade}
                    </span>
                  </td>
                  <td style={td}>{item.credor}</td>
                  <td style={td}>{item.tipo_credor}</td>
                  <td style={td}>{item.parcela_atual}/{item.total_parcelas}</td>
                  <td style={td}>{Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td style={{ ...td, color: vencido ? '#C8102E' : '#333', fontWeight: vencido ? 'bold' : 'normal' }}>
                    {formatarDataBR(item.data_vencimento)} {vencido && '(vencido)'}
                  </td>
                  <td style={td}>{LABEL_STATUS[item.status] || item.status}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    {item.status !== 'pago' && (
                      <>
                        <button onClick={() => setPagando(item.id)} style={btn('#0B3D91')}>Pagar</button>
                        <button onClick={() => setAgendando(item.id)} style={btn('#E08E00')}>Agendar</button>
                      </>
                    )}
                    <button onClick={() => onEditar(item)} style={btn('#333')}>Editar</button>
                    {pagando === item.id && (
                      <FormRapido
                        campos={[
                          { nome: 'data_pagamento', label: 'Data', tipo: 'date', valorPadrao: hoje },
                          { nome: 'forma_pagamento', label: 'Forma', tipo: 'text' },
                          { nome: 'comprovante_url', label: 'Link comprovante', tipo: 'text' },
                        ]}
                        onConfirmar={(dados) => { onPagar(item.id, dados); setPagando(null); }}
                        onCancelar={() => setPagando(null)}
                      />
                    )}
                    {agendando === item.id && (
                      <FormRapido
                        campos={[{ nome: 'data_agendada', label: 'Agendar para', tipo: 'date', obrigatorio: true }]}
                        onConfirmar={(dados) => { onAgendar(item.id, dados.data_agendada); setAgendando(null); }}
                        onCancelar={() => setAgendando(null)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
            {itens.length === 0 && (
              <tr><td style={td} colSpan={8}>Nenhum lancamento encontrado para este filtro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function FormRapido({ campos, onConfirmar, onCancelar }) {
  const [valores, setValores] = useState(() => {
    const inicial = {};
    campos.forEach((c) => { inicial[c.nome] = c.valorPadrao || ''; });
    return inicial;
  });
  function confirmar() {
    for (const c of campos) {
      if (c.obrigatorio && !valores[c.nome]) {
        alert(`Preencha o campo ${c.label}`);
        return;
      }
    }
    onConfirmar(valores);
  }
  return (
    <div style={{ position: 'absolute', background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 12, boxShadow: '0 4px 16px rgba(0,0,0,.15)', zIndex: 10, marginTop: 8 }}>
      {campos.map((c) => (
        <div key={c.nome} style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 2 }}>{c.label}</label>
          <input
            type={c.tipo}
            value={valores[c.nome]}
            onChange={(e) => setValores({ ...valores, [c.nome]: e.target.value })}
            style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', width: 200 }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={confirmar} style={{ ...btn('#0B3D91'), margin: 0 }}>Confirmar</button>
        <button onClick={onCancelar} style={{ ...btn('#999'), margin: 0 }}>Cancelar</button>
      </div>
    </div>
  );
}
const th = { padding: 10, fontSize: 13, color: '#555', borderBottom: '2px solid #ddd' };
const td = { padding: 10, fontSize: 14, position: 'relative' };
function btn(cor) {
  return { background: cor, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 12, cursor: 'pointer', marginRight: 6, marginBottom: 4 };
}
